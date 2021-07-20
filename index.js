var svg = document.getElementById("svg");
var svgns = "http://www.w3.org/2000/svg"
var insertButton = document.getElementById("insertButton");
var findButton = document.getElementById("findButton");
var deleteButton = document.getElementById("deleteButton");
var root = null;


class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        // each node holds it's own coordinates
        this.cx = 0;
        this.cy = 0;
    }
}

function getRadius(cy) {
    let radius = 0;
    let height = (parseInt(cy) - 100) / 80;
    if (height > 4) {
        radius = 12.5;
    }
    else {
        radius = (30 - height * 3);
    }
    return radius;
}

function nodeNotFoundPopUp(nodeVal) {
    alert(nodeVal + " could not be found in the current tree.");
}

function noDuplicatesPopUp(newNodeVal) {
    alert("This tree already includes " + newNodeVal + " and BSTs do not allow duplicates. Please try a different number.");
}

// creates the circle and centers text within for a node
function createNodeInDOM(node, animating) {
    let height, radius = 0;
    const nodeCircle = document.createElementNS(svgns, "circle");
    svg.appendChild(nodeCircle);
    nodeCircle.setAttribute("cx", node.cx);
    nodeCircle.setAttribute("cy", node.cy);

    // decrease circle radius as height increases

    nodeCircle.setAttribute("r", getRadius(node.cy).toString());
    nodeCircle.setAttribute("stroke", "green");
    nodeCircle.setAttribute("stroke-width", "2");
    nodeCircle.setAttribute("fill", "yellow");

    const nodeText = document.createElementNS(svgns, "text");
    svg.appendChild(nodeText);
    nodeText.setAttribute("x", node.cx);
    nodeText.setAttribute("y", node.cy);
    nodeText.setAttribute("dominant-baseline", "middle");
    nodeText.setAttribute("text-anchor", "middle");
    nodeText.innerHTML = node.data;

    if (animating) {
        nodeCircle.setAttribute("id", "animatingNode");
        nodeCircle.setAttribute("fill", "white");
        nodeCircle.setAttribute("r", "15");
        nodeCircle.setAttribute("cx", "400");
        nodeCircle.setAttribute("cy", "80");

        nodeText.setAttribute("id", "animatingText");
        nodeText.setAttribute("x", "400");
        nodeText.setAttribute("y", "80");
    }

}

function animateNode(parentNode, currNode, isFinalMove) {
    currNodeCxInt = parseInt(currNode.cx);
    currNodeCyInt = parseInt(currNode.cy);
    parentNodeCxInt = parseInt(parentNode.cx);
    parentNodeCyInt = parseInt(parentNode.cy);
    // get elements from DOM to animate - a text element and a circle element
    const animNode = document.getElementById("animatingNode");
    const animText = document.getElementById("animatingText");

    // y distance to travel - always positive
    let diffY = currNodeCyInt - parentNodeCyInt;
    // x distance to travel, positive if currNode on right of parentNode
    let diffX = currNodeCxInt - parentNodeCxInt;

    let startTime = 0;
    const totalTime = 1000; // 1000ms = 1s
    const animateStep = (timestamp) => {
        if (!startTime) startTime = timestamp;

        // progress goes from 0 to 1 over 1s
        const progress = (timestamp - startTime) / totalTime;
        // change circle cx and cy values to move diagonally
        animNode.setAttributeNS(null, 'cx', parentNodeCxInt + (diffX * progress));
        animNode.setAttributeNS(null, 'cy', (parentNodeCyInt - 20) + (diffY * progress));
        // do the same for the text but x and y instead of cx and cy
        animText.setAttributeNS(null, 'x', parentNodeCxInt + (diffX * progress));
        animText.setAttributeNS(null, 'y', (parentNodeCyInt - 20) + (diffY * progress));

        if (progress < 1) {
            window.requestAnimationFrame(animateStep);
            console.log("progress happening");
        }
        else if (isFinalMove) {
            console.log("progress complete!");
            animNode.remove();
            animText.remove();
            createNodeInDOM(currNode, 0);
        }
        else {
            console.log("progress complete!");
            animNode.remove();
            animText.remove();
        }
    }
    window.requestAnimationFrame(animateStep);
}

function createEdgeInDOM(parentNode, currNode) {
    currNodeCxInt = parseInt(currNode.cx);
    currNodeCyInt = parseInt(currNode.cy);
    parentNodeCxInt = parseInt(parentNode.cx);
    parentNodeCyInt = parseInt(parentNode.cy);
    let height, currRadius, parentRadius, angle, x1, y1, x2, y2 = 0;

    const edge = document.createElementNS(svgns, "line");
    svg.appendChild(edge);
    edge.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:3");

    // gets radius of currNode and parentNode
    currRadius = getRadius(currNode.cy);
    parentRadius = getRadius(parentNode.cy);


    // calculate xdifference and ydifference
    cxDif = Math.abs(currNodeCxInt - parentNodeCxInt);
    cyDif = currNodeCyInt - parentNodeCyInt;
    // calculates length of line
    Math.hypot(cyDif, cxDif);
    // calculates angle from currNode to parentNode from x axis (no negatives)
    angle = Math.atan(cyDif / cxDif) * (180 / Math.PI);
    // the percent of 625 that should be change in cy and in cx
    cyProportion = angle / 90;
    cxProportion = 1 - cyProportion;
    // calculates the difference in cy to achieve hypot of 25 (25^2 is 625)
    y2 = currNodeCyInt - Math.sqrt(currRadius * currRadius * cyProportion);
    y1 = parentNodeCyInt + Math.sqrt(parentRadius * parentRadius * cyProportion);

    if (currNodeCxInt < parentNodeCxInt) {
        x1 = parentNodeCxInt - Math.sqrt(parentRadius * parentRadius * cxProportion)
        x2 = currNodeCxInt + Math.sqrt(parentRadius * parentRadius * cxProportion);
    }
    else {
        x1 = parentNodeCxInt + Math.sqrt(parentRadius * parentRadius * cxProportion)
        x2 = currNodeCxInt - Math.sqrt(currRadius * currRadius * cxProportion);
    }

    edge.setAttribute("x1", x1.toString());
    edge.setAttribute("y1", y1.toString());
    edge.setAttribute("y2", y2.toString());
    edge.setAttribute("x2", x2.toString());

}

// Binary Search tree class
class BinarySearchTree {
    constructor() {
        // root of a binary search tree
        this.root = null;
    }

    // creates new node to be inserted and calls insertNode
    insert(data) {
        var newNode = new Node(data);
        // if root is null then node will
        // be added to the tree and made root.
        if (this.root === null) {
            newNode.cx = "400";
            newNode.cy = "100";
            this.root = newNode;

            createNodeInDOM(newNode, 0);
        }
        else {

            createNodeInDOM(newNode, 1);
            this.insertNode(this.root, newNode, 1);
        }
    }

    //calcCxCy(parentNode)

    insertNode(node, newNode, height) {
        if (newNode.data < node.data) {
            // if left is null insert node here
            if (node.left == null) {
                node.left = newNode;
                newNode.cx = (parseInt(node.cx) - 400 * (Math.pow(0.5, height))).toString();
                newNode.cy = (parseInt(node.cy) + 80).toString();

                //createNodeInDOM(newNode, 1);
                animateNode(node, newNode, 1);
                createEdgeInDOM(node, newNode);
            }

            else {
                //createNodeInDOM(newNode, 1);
                animateNode(node, newNode, 0);
                // find null by recursion
                this.insertNode(node.left, newNode, height + 1);
            }
        }

        // if the data is more than the node
        // data move right of the tree
        else if (newNode.data > node.data) {
            // if right is null insert node here
            if (node.right == null) {
                node.right = newNode;
                newNode.cx = (parseInt(node.cx) + 400 * (Math.pow(0.5, height))).toString();
                newNode.cy = (parseInt(node.cy) + 80).toString();

                //createNodeInDOM(newNode, 1);
                animateNode(node, newNode, 1);
                createEdgeInDOM(node, newNode);

            }
            else {
                //createNodeInDOM(newNode, 1);
                animateNode(node, newNode, 0);
                // find null by recursion
                this.insertNode(node.right, newNode, height + 1);
            }
        }
    }

    find(nodeVal) {
        if (this.root == null) {
            nodeNotFoundPopUp(nodeVal);
        }
        else {
            this.findNode(this.root, nodeVal);
        }
    }

    findNode(root, nodeVal) {
        if (nodeVal < root.data) {
            if (root.left == null) {
                nodeNotFoundPopUp(nodeVal);
            }
            else {
                this.findNode(root.left, nodeVal);
            }
            
            
        }
        else if (nodeVal > root.data) {
            if (root.right == null) {
                nodeNotFoundPopUp(nodeVal);
            }
            else {
                this.findNode(root.right, nodeVal);
            }
            
        }
        else if (nodeVal == root.data) {

        }
    }

}



var thisTree = new BinarySearchTree();
const tree = [];

insertButton.onclick = function insertVal() {
    // get new node value from input button
    var newNodeVal = document.getElementById("insertInput").value;

    // check for duplicates using tree array
    if (tree.includes(newNodeVal)) {
        noDuplicatesPopUp(newNodeVal);
    }
    else {
        tree.push(newNodeVal);
        console.log("value in node is: " + newNodeVal);
        //createNodeInDOM(newNodeVal, "50", "50");
        thisTree.insert(parseInt(newNodeVal));
    }
}

findButton.onclick = function findVal() {
    // get new node value from input button
    var findVal = document.getElementById("findInput").value;
    console.log("value to find is: " + findVal);
    //createNodeInDOM(newNodeVal, "50", "50");
    thisTree.find(parseInt(findVal));

}




//<circle cx="50" cy="50" r="25" stroke="green" stroke-width="4" fill="yellow" />
//<text x="50" y="50" dominant-baseline="middle" text-anchor="middle">TEXT</text>
//<line x1="400" y1="100" x2="200" y2="180" style="stroke:rgb(0, 0, 0);stroke-width:2" />
// <line x1="400" y1="100" x2="600" y2="180" style="stroke:rgb(255,0,0);stroke-width:2" />
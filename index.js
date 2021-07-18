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

// creates the circle and centers text within for a node
function createNodeInDOM(data, cx, cy) {
    let height, radius = 0;
    const nodeCircle = document.createElementNS(svgns, "circle");
    svg.appendChild(nodeCircle);
    nodeCircle.setAttribute("cx", cx);
    nodeCircle.setAttribute("cy", cy);

    // decrease circle radius as height increases

    nodeCircle.setAttribute("r", getRadius(cy).toString());
    nodeCircle.setAttribute("stroke", "green");
    nodeCircle.setAttribute("stroke-width", "4");
    nodeCircle.setAttribute("fill", "yellow");

    const nodeText = document.createElementNS(svgns, "text");
    svg.appendChild(nodeText);
    nodeText.setAttribute("x", cx);
    nodeText.setAttribute("y", cy);
    nodeText.setAttribute("dominant-baseline", "middle");
    nodeText.setAttribute("text-anchor", "middle");
    nodeText.innerHTML = data;

}

//
function createEdgeInDOM(parentNode, currNode) {
    currNodeCxInt = parseInt(currNode.cx);
    currNodeCyInt = parseInt(currNode.cy);
    parentNodeCxInt = parseInt(parentNode.cx);
    parentNodeCyInt = parseInt(parentNode.cy);
    let height, currRadius, parentRadius, angle, x1, y1, x2, y2 = 0;

    const edge = document.createElementNS(svgns, "line");
    svg.appendChild(edge);
    edge.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:3");

    // gets radius of currNode
    currRadius = getRadius(currNode.cy);

    // gets radius of parentNode
    parentRadius = getRadius(parentNode.cy);


    // calculate xdifference and ydifference
    cxDif = Math.abs(currNodeCxInt - parentNodeCxInt);
    cyDif = currNodeCyInt - parentNodeCyInt;
    // calculates length of line
    Math.hypot(cyDif, cxDif);
    // calculates angle from currNode to parentNode from x axis (no negatives)
    angle = Math.atan(cyDif / cxDif) * (180 / Math.PI);
    console.log(angle);
    // the percent of 625 that should be change in cy and in cx
    cyProportion = angle / 90;
    cxProportion = 1 - cyProportion;
    // calculates the difference in cy to achieve hypot of 25 (25^2 is 625)
    y2 = currNodeCyInt - Math.sqrt(currRadius * currRadius * cyProportion);
    y1 = parentNodeCyInt + Math.sqrt(parentRadius * parentRadius * cyProportion);

    // 
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

            createNodeInDOM(data, newNode.cx, newNode.cy);
        }
        else {
            // find the correct position in the
            // tree and add the node
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
                createEdgeInDOM(node, newNode);
                createNodeInDOM(newNode.data, newNode.cx, newNode.cy);

            }

            else {
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
                createEdgeInDOM(node, newNode);
                createNodeInDOM(newNode.data, newNode.cx, newNode.cy);

            }
            else {
                // find null by recursion
                this.insertNode(node.right, newNode, height + 1);
            }
        }
    }

    removeNode(node) {
        // will perform on the selected node


    }

    // Helper function
    // findMinNode()
    // getRootNode()
    // inorder(node)
    // preorder(node)              
    // postorder(node)
    // search(node, data)
}

const svgWidth = 800;
const svgHeight = 800;

var thisTree = new BinarySearchTree();

insertButton.onclick = function insertVal() {
    // get new node value from input button
    var newNodeVal = document.getElementById("insertInput").value;
    console.log("valeu in node is: " + newNodeVal);
    //createNodeInDOM(newNodeVal, "50", "50");
    thisTree.insert(parseInt(newNodeVal));

}




//<circle cx="50" cy="50" r="25" stroke="green" stroke-width="4" fill="yellow" />
//<text x="50" y="50" dominant-baseline="middle" text-anchor="middle">TEXT</text>
//<line x1="400" y1="100" x2="200" y2="180" style="stroke:rgb(0, 0, 0);stroke-width:2" />
// <line x1="400" y1="100" x2="600" y2="180" style="stroke:rgb(255,0,0);stroke-width:2" />
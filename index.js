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

// creates the circle and centers text within for a node
function createNodeInDOM(data, cx, cy) {
    const nodeCircle = document.createElementNS(svgns, "circle");
    svg.appendChild(nodeCircle);
    nodeCircle.setAttribute("cx", cx);
    nodeCircle.setAttribute("cy", cy);
    nodeCircle.setAttribute("r", "25");
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

//function createEdgeInDOM(parentCx, parentCy,)

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

    // Method to insert a node in a tree
    // it moves over the tree to find the location
    // to insert a node with a given data
    insertNode(node, newNode, height) {
        if (newNode.data < node.data) {
            // if left is null insert node here
            if (node.left === null) {
                node.left = newNode;
                newNode.cx = (parseInt(node.cx) - 400 * (Math.pow(0.5, height))).toString();
                newNode.cy = (parseInt(node.cy) + 160).toString();
                console.log(newNode.cx);
                createNodeInDOM(newNode.data, newNode.cx, newNode.cy);
            }

            else {
                // find null by recursion
                this.insertNode(node.left, newNode, height + 1);
            }

        }

        // if the data is more than the node
        // data move right of the tree
        else {
            // if right is null insert node here
            if (node.right === null) {
                node.right = newNode;
                newNode.cx = (parseInt(node.cx) + 400 * (Math.pow(0.5, height))).toString();
                newNode.cy = (parseInt(node.cy) + 160).toString();
                console.log(newNode.cx);
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
    //createNodeInDOM(newNodeVal, "50", "50");
    thisTree.insert(newNodeVal);

}




//<circle cx="50" cy="50" r="25" stroke="green" stroke-width="4" fill="yellow" />
//<text x="50" y="50" dominant-baseline="middle" text-anchor="middle">TEXT</text>
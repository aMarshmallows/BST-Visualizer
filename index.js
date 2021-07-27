const svg = document.getElementById("svg");
const table = document.getElementById("traversalTable");
const svgns = "http://www.w3.org/2000/svg";
const randoGenButton = document.getElementById("randoGenButton");
const insertButton = document.getElementById("insertButton");
const findButton = document.getElementById("findButton");
const preTravButton = document.getElementById("preTravButton");
const inTravButton = document.getElementById("inTravButton");
const postTravButton = document.getElementById("postTravButton");
let root = null;

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    // each node holds it's own coordinates
    this.cx = 0;
    this.cy = 0;
    // will hold the animating node and text elements initally
    // changing to the permanant node elements once animation is over
    this.domNode = null;
    this.domText = null;
  }
}

function getRadius(cy) {
  let radius = 0;
  const height = (parseInt(cy) - 100) / 80;
  if (height > 4) {
    radius = 12.5;
  } else {
    radius = 30 - height * 3;
  }
  return radius;
}

function nodeNotFoundPopUp(nodeVal) {
  alert(nodeVal + " could not be found in the current tree.");
}

function noDuplicatesPopUp(newNodeVal) {
  alert(
    "This tree already includes " +
      newNodeVal +
      " and BSTs do not allow duplicates. Please try a different number."
  );
}

function notANumPopUp() {
  alert("Please enter a valid integer");
}

// creates the circle and centers text within
// different attributes depending if node is a temp animating node or a permanant one
// id is set only if animating node
// sets node.domNode and node.domText
function createNodeInDOM(node, animating) {
  let height,
    radius = 0;
  const nodeCircle = document.createElementNS(svgns, "circle");
  node.domNode = nodeCircle;
  svg.appendChild(nodeCircle);
  nodeCircle.setAttribute("cx", node.cx);
  nodeCircle.setAttribute("cy", node.cy);
  nodeCircle.setAttribute("r", getRadius(node.cy).toString());
  nodeCircle.setAttribute("stroke", "green");
  nodeCircle.setAttribute("stroke-width", "2");
  nodeCircle.setAttribute("fill", "yellow");

  const nodeText = document.createElementNS(svgns, "text");
  node.domText = nodeText;
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
    nodeCircle.setAttribute("cy", "60");

    nodeText.setAttribute("id", "animatingText");
    nodeText.setAttribute("x", "400");
    nodeText.setAttribute("y", "60");
  }
}

// animates the path from one node to another
function animateNode2(node, text, startX, startY, endX, endY, speed, callback) {
  let startTime, previousTimeStamp;
  // y distance to travel - always positive
  const diffY = endY - startY;
  // x distance to travel, positive if currNode on right of parentNode
  const diffX = endX - startX;
  const totalTime = speed;
  function step(timestamp) {
    if (startTime === undefined) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (previousTimeStamp !== timestamp) {
      // progress goes from 0 to 1 over 1s
      const progress = (timestamp - startTime) / totalTime;
      // change circle cx and cy values to move diagonally
      node.setAttributeNS(null, "cx", startX + diffX * progress);
      node.setAttributeNS(null, "cy", startY - 20 + diffY * progress);
      // do the same for the text but x and y instead of cx and cy
      text.setAttributeNS(null, "x", startX + diffX * progress);
      text.setAttributeNS(null, "y", startY - 20 + diffY * progress);
    }

    if (elapsed < totalTime) {
      // Stop the animation after 2 seconds
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(step);
    } else {
      if (callback) {
        callback();
      }
    }
  }

  window.requestAnimationFrame(step);
}

// changes internal text to be "<" or ">" depending on if
// data is smaller or larger than the node it is above
// changes it back to number value after animation
function animateLargerSmaller(text, data, speed, callback) {
  let startTime, previousTimeStamp;
  const totalTime = speed / 2;
  const num = parseFloat(text.innerHTML);

  function step(timestamp) {
    if (startTime === undefined) startTime = timestamp;
    const elapsed = timestamp - startTime;
    if (previousTimeStamp !== timestamp) {
      if (num > parseFloat(data)) {
        text.innerHTML = ">";
      } else if (num < parseFloat(data)) {
        text.innerHTML = "<";
      }
    }

    if (elapsed < totalTime) {
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(step);
    } else {
      text.innerHTML = num;
      if (callback) {
        callback();
      }
    }
  }
  window.requestAnimationFrame(step);
}

// animate found node with different color to show operation is complete
function animateFound(domNode, speed, callback) {
  let startTime, previousTimeStamp;
  const totalTime = speed / 2;
  const radius = parseInt(domNode.getAttribute("r")) + 5;

  function step(timestamp) {
    if (startTime === undefined) startTime = timestamp;
    const elapsed = timestamp - startTime;
    if (previousTimeStamp !== timestamp) {
      domNode.setAttributeNS(null, "fill", "blue");
      domNode.setAttributeNS(null, "r", radius.toString());
      domNode.setAttributeNS(null, "stroke", "white");
    }

    if (elapsed < totalTime) {
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(step);
    } else {
      domNode.setAttributeNS(null, "fill", "yellow");
      domNode.setAttributeNS(null, "r", (radius - 5).toString());
      domNode.setAttributeNS(null, "stroke", "green");
      if (callback) {
        callback();
      }
    }
  }
  window.requestAnimationFrame(step);
}

// changes inner text to show which direction is next for the node
function animatePath(text, dir, speed, callback) {
  let startTime, previousTimeStamp;
  const totalTime = speed / 2;

  function step(timestamp) {
    if (startTime === undefined) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (previousTimeStamp !== timestamp) {
      if (dir == "left") {
        text.innerHTML = "⇙";
      } else if (dir == "right") {
        text.innerHTML = "⇘";
      } else if (dir == "UnSucc") {
        text.innerHTML = ":(";
      } else if (dir == "up") {
        text.innerHTML = "⇑";
      }
    }

    if (elapsed < totalTime) {
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(step);
    } else {
      text.innerHTML = " ";

      if (callback) {
        callback();
      }
    }
  }
  window.requestAnimationFrame(step);
}

// creates edge from one node to another
function createEdgeInDOM(parentNode, currNode) {
  currNodeCxInt = parseInt(currNode.cx);
  currNodeCyInt = parseInt(currNode.cy);
  parentNodeCxInt = parseInt(parentNode.cx);
  parentNodeCyInt = parseInt(parentNode.cy);
  let height,
    currRadius,
    parentRadius,
    angle,
    x1,
    y1,
    x2,
    y2 = 0;

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
    x1 =
      parentNodeCxInt - Math.sqrt(parentRadius * parentRadius * cxProportion);
    x2 = currNodeCxInt + Math.sqrt(parentRadius * parentRadius * cxProportion);
  } else {
    x1 =
      parentNodeCxInt + Math.sqrt(parentRadius * parentRadius * cxProportion);
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

  insert(data, animating) {
    const newNode = new Node(data);
    // if root is null then node will
    // be added to the tree and made root.
    if (this.root === null) {
      newNode.cx = "400";
      newNode.cy = "80";
      this.root = newNode;

      createNodeInDOM(newNode, false);
    } else if (animating) {
      createNodeInDOM(newNode, true);
      this.insertNode(this.root, newNode, 1, true);
    } else {
      this.insertNode(this.root, newNode, 1, false);
    }
  }

  insertNode(node, newNode, height, animating) {
    if (newNode.data < node.data) {
      // if left is null insert node here
      if (node.left == null) {
        node.left = newNode;
        newNode.cx = (
          parseInt(node.cx) -
          400 * Math.pow(0.5, height)
        ).toString();
        newNode.cy = (parseInt(node.cy) + 80).toString();

        if (animating) {
          animateNode2(
            newNode.domNode,
            newNode.domText,
            parseInt(node.cx),
            parseInt(node.cy),
            parseInt(newNode.cx),
            parseInt(newNode.cy),
            slider.value,
            () => {
              newNode.domNode.remove();
              newNode.domText.remove();
              createNodeInDOM(newNode, false);
              createEdgeInDOM(node, newNode);
            }
          );
        } else {
          createNodeInDOM(newNode, false);
          createEdgeInDOM(node, newNode);
        }
      } else {
        if (animating) {
          animateNode2(
            newNode.domNode,
            newNode.domText,
            parseInt(node.cx),
            parseInt(node.cy),
            parseInt(node.left.cx),
            parseInt(node.left.cy),
            slider.value,
            () => {
              // find null by recursion
              this.insertNode(node.left, newNode, height + 1, true);
            }
          );
        } else {
          this.insertNode(node.left, newNode, height + 1, false);
        }
      }
    } else if (newNode.data > node.data) {
      // if right is null insert node here
      if (node.right == null) {
        node.right = newNode;
        newNode.cx = (
          parseInt(node.cx) +
          400 * Math.pow(0.5, height)
        ).toString();
        newNode.cy = (parseInt(node.cy) + 80).toString();

        if (animating) {
          animateNode2(
            newNode.domNode,
            newNode.domText,
            parseInt(node.cx),
            parseInt(node.cy),
            parseInt(newNode.cx),
            parseInt(newNode.cy),
            slider.value,
            () => {
              newNode.domNode.remove();
              newNode.domText.remove();
              createNodeInDOM(newNode, false);
              createEdgeInDOM(node, newNode);
            }
          );
        } else {
          createNodeInDOM(newNode, false);
          createEdgeInDOM(node, newNode);
        }
      } else {
        if (animating) {
          animateNode2(
            newNode.domNode,
            newNode.domText,
            parseInt(node.cx),
            parseInt(node.cy),
            parseInt(node.right.cx),
            parseInt(node.right.cy),
            slider.value,
            () => {
              // find null by recursion
              this.insertNode(node.right, newNode, height + 1, true);
            }
          );
        } else {
          this.insertNode(node.right, newNode, height + 1, false);
        }
      }
    }
  }

  find(nodeVal) {
    const findNode = new Node(nodeVal);
    if (this.root == null) {
      nodeNotFoundPopUp(nodeVal);
    } else {
      findNode.cx = "400";
      findNode.cy = "80";
      createNodeInDOM(findNode, true);
      this.findNode(this.root, findNode);
    }
  }

  findNode(root, node) {
    if (node.data < root.data) {
      if (root.left == null) {
        nodeNotFoundPopUp(node.data);
        node.domNode.remove();
        node.domText.remove();
      } else {
        animateLargerSmaller(node.domText, root.data, slider.value, () => {
          animateNode2(
            node.domNode,
            node.domText,
            parseInt(root.cx),
            parseInt(root.cy),
            parseInt(root.left.cx),
            parseInt(root.left.cy),
            slider.value,
            () => {
              this.findNode(root.left, node);
            }
          );
        });
      }
    } else if (node.data > root.data) {
      if (root.right == null) {
        nodeNotFoundPopUp(node.data);
        node.domNode.remove();
        node.domText.remove();
      } else {
        animateLargerSmaller(node.domText, root.data, slider.value, () => {
          animateNode2(
            node.domNode,
            node.domText,
            parseInt(root.cx),
            parseInt(root.cy),
            parseInt(root.right.cx),
            parseInt(root.right.cy),
            slider.value,
            () => {
              this.findNode(root.right, node);
            }
          );
        });
      }
    } else if (node.data == root.data) {
      node.domNode.remove();
      node.domText.remove();
      animateFound(root.domNode, slider.value, false);
    }
  }
}

function addToArray(text, index, callback) {
  // get square to insert array
  const cell = document.getElementById("td" + index.toString());
  cell.innerHTML = text;

  if (callback) {
    callback();
  }
}

function iterativePreorder(root) {
  let counter = 0;
  // Base Case
  if (root == null) {
    return;
  }

  // Create an empty stack and push root to it
  var nodeStack = [];
  nodeStack.push(root);
  let preOrder123 = window.setInterval(() => {
    if (nodeStack.length > 0) {
      // Pop the top item from stack and print it
      let mynode = nodeStack[nodeStack.length - 1];
      animateFound(mynode.domNode, slider.value, () => {
        addToArray(mynode.domText.innerHTML, counter, () => {
          counter++;
          nodeStack.pop();
        });

        // Push right and left children of
        // the popped node to stack
        if (mynode.right != null) {
          nodeStack.push(mynode.right);
        }
        if (mynode.left != null) {
          nodeStack.push(mynode.left);
        }
      });
    } else {
      window.clearInterval(preOrder123);
    }
  }, slider.value);
}
/*
function iterativePostorder(node) {
  let counter = 0;
  let nodeStack = [];

  // Check for empty tree
  if (node == null) return nodeStack;
  nodeStack.push(node);
  let prev = null;
  let postOrder123 = window.setInterval(() => {
    if (nodeStack.length != 0) {
      let mynode = nodeStack[nodeStack.length - 1];

      //go down the tree in search of a leaf an if so process it
            //and pop stack otherwise move down
      if (prev == null || prev.left == mynode || prev.right == mynode) {
        if (mynode.left != null) {
          nodeStack.push(mynode.left);
        } else if (mynode.right != null) {
          nodeStack.push(mynode.right);
        } else {
          animateFound(mynode.domNode, slider.value * 2, () => {
            addToArray(mynode.domText.innerHTML, counter, () => {
              counter++;
              nodeStack.pop();
            });
          });
        }

        // go up the tree from left node, if the child is right
        // push it onto stack otherwise process parent and popstack
      } else if (mynode.left == prev) {
        if (mynode.right != null) {
          nodeStack.push(mynode.right);
        } else {
          animateFound(mynode.domNode, slider.value * 2, () => {
            addToArray(mynode.domText.innerHTML, counter, () => {
              counter++;
              nodeStack.pop();
            });
          });
        }

        
      } else if (mynode.right == prev) {
        animateFound(mynode.domNode, slider.value * 2, () => {
          addToArray(mynode.domText.innerHTML, counter, () => {
            counter++;
            nodeStack.pop();
          });
        });
      }

      prev = mynode;
    } else {
      window.clearInterval(postOrder123);
    }
  }, slider.value / 2);
}
*/
function iterativePostorder(root) {
  // Two stacks as used in explanation
  // Create two stacks
  var s1 = [];
  var s2 = [];

  if (root == null) return;

  // Push root to first stack
  s1.push(root);

  // Run while first stack is not empty
  while (s1.length > 0) {
    // Pop an item from s1 and Push it to s2
    var temp = s1.pop();
    s2.push(temp);

    // Push left and right children of
    // removed item to s1
    if (temp.left != null) s1.push(temp.left);
    if (temp.right != null) s1.push(temp.right);
  }
  let counter = 0;
  // Print all elements of second stack
  let postOrder123 = window.setInterval(() => {
    if (s2.length > 0) {
      var temp = s2[s2.length - 1];
      animateFound(temp.domNode, slider.value * 2, () => {
        addToArray(temp.domText.innerHTML, counter, () => {
          counter++;
          s2.pop();
        });
      });
    } else {
      window.clearInterval(postOrder123);
    }
  }, slider.value);
}

function iterativeInorder(root) {
  let counter = 0;
  if (root == null) {
    return;
  }

  nodeStack = [];
  let mynode = root;
  let postOrder123 = window.setInterval(() => {
    if (mynode != null || nodeStack.length > 0) {
      while (mynode != null) {
        nodeStack.push(mynode);
        mynode = mynode.left;
      }

      mynode = nodeStack.pop();
      console.log(mynode.data);
      let text = mynode.domText.innerHTML;
      animateFound(mynode.domNode, slider.value * 2, () => {
        addToArray(text, counter, () => {
          counter++;
        });
      });
      // deal with current
      mynode = mynode.right;
    }
  }, slider.value);
}

function preOrderTravHelper() {
  iterativePreorder(thisTree.root);
}

function inOrderTravHelper() {
  iterativeInorder(thisTree.root);
}

function postOrderTravHelper() {
  iterativePostorder(thisTree.root);
}

function changeSpeed() {
  let val = this.value;
  time = (val / 1000).toFixed(1);
  document.getElementById("SelectValue").innerHTML = time;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// tree will only include integers
// generates a random tree
function randoTreeGen() {
  // delete the existing tree
  thisTree = new BinarySearchTree();
  removeAllChildNodes(svg);
  tree = [];

  // num of nodes should be between 3 and 25
  const numNodes = Math.round(Math.random() * (25 - 3) + 3); // range is 3 to 25

  // for each node get a node value
  for (let i = 0; i < numNodes; i++) {
    // ensure no duplicates
    do {
      nodeVal = Math.round(Math.random() * (100 - 1) + 1);
    } while (tree.includes(nodeVal));

    tree.push(nodeVal);
    thisTree.insert(nodeVal, false);
  }
}

function insertVal() {
  // get new node value from input button
  const newNodeVal = document.getElementById("insertInput").value;

  // if not a number show an error message
  try {
    if (isNaN(parseFloat(newNodeVal))) throw "notNum";
  } catch (error) {
    notANumPopUp();
    return;
  }

  // check for duplicates using tree array
  if (tree.includes(parseFloat(newNodeVal))) {
    noDuplicatesPopUp(newNodeVal);
  } else {
    tree.push(parseFloat(newNodeVal));
    //createNodeInDOM(newNodeVal, "50", "50");
    thisTree.insert(parseFloat(newNodeVal), true);
  }
}

let thisTree = new BinarySearchTree();
let tree = [];

function findVal() {
  // get new node value from input button
  let findVal = document.getElementById("findInput").value;
  //createNodeInDOM(newNodeVal, "50", "50");
  thisTree.find(parseFloat(findVal));
}

// creates array to hold in traversal numbers
function createTravArray(len, callback) {
  // repaints array to have current number of nodes as cells
  removeAllChildNodes(table);
  const tr = document.createElement("tr");
  // create row to hold cells
  table.appendChild(tr);
  // append cells to row
  for (let i = 0; i < len; i++) {
    let cell_name = "td" + i.toString();
    let td = document.createElement(cell_name);
    td.setAttribute("id", cell_name);
    tr.appendChild(td).classList.add("cells");
  }

  if (callback) {
    callback();
  }
}

// slider value gives num of grid cells per row and col
slider.addEventListener("click", changeSpeed);

randoGenButton.addEventListener("click", randoTreeGen);

insertButton.addEventListener("click", insertVal);

findButton.addEventListener("click", findVal);

preTravButton.addEventListener("click", function preOrder() {
  console.log("inside preorder");
  const len = tree.length;
  createTravArray(len, preOrderTravHelper);
});

inTravButton.addEventListener("click", function inOrder() {
  const len = tree.length;
  createTravArray(len, inOrderTravHelper);
});

postTravButton.addEventListener("click", function postOrder() {
  const len = tree.length;
  createTravArray(len, postOrderTravHelper);
});

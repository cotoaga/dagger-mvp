document.addEventListener('DOMContentLoaded', () => {
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      { data: { id: '1', title: '1', hasMainChild: false } }
    ],
    style: [
      {
        selector: 'node',
        style: {
          'width': '200px',
          'height': '100px',
          'background-color': 'transparent',
          'label': '',
          'text-valign': 'center',
          'text-halign': 'center'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#FFF',
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: 'edge.branch',
        style: {
          'line-style': 'dashed',
          'line-color': '#CCC'
        }
      }
    ]
  });

  // Custom layout to position nodes
  function customLayout() {
    const nodes = cy.nodes();
    const mainThread = [];
    const subThreads = {};

    // Organize nodes into main thread and sub-threads
    nodes.forEach(node => {
      const id = node.id();
      if (id.includes('.')) {
        const parentId = id.split('.')[0];
        if (!subThreads[parentId]) subThreads[parentId] = [];
        subThreads[parentId].push(node);
      } else {
        mainThread.push(node);
      }
    });

    // Position main thread nodes vertically
    mainThread.forEach((node, index) => {
      node.position({ x: 300, y: 100 + index * 150 });
    });

    // Position sub-thread nodes to the right and below their parent
    Object.keys(subThreads).forEach(parentId => {
      const parent = cy.getElementById(parentId);
      const parentPos = parent.position();
      subThreads[parentId].forEach((subNode, index) => {
        subNode.position({ x: parentPos.x + 250 * (index + 1), y: parentPos.y + 100 });
      });
    });
  }

  // Function to render node content (text field and buttons)
  function renderNodeContent(node) {
    const div = document.createElement('div');
    div.className = 'node-container';
    div.setAttribute('data-id', node.id());
    div.style.position = 'absolute';
    div.style.left = node.renderedPosition('x') - 100 + 'px';
    div.style.top = node.renderedPosition('y') - 50 + 'px';

    const textarea = document.createElement('textarea');
    textarea.className = 'node-textarea';
    textarea.value = node.data('text') || node.data('title');
    textarea.addEventListener('input', (e) => {
      node.data('text', e.target.value);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'node-buttons';

    const addButton = document.createElement('button');
    addButton.className = 'node-button';
    addButton.innerText = '+';
    addButton.disabled = node.data('hasMainChild'); // Disable if already has a main child
    addButton.addEventListener('click', () => {
      if (node.data('hasMainChild')) return; // Prevent adding more than one main child
      const parentId = node.id();
      const newId = parseInt(parentId) + 1;
      cy.add([
        { data: { id: newId.toString(), title: newId.toString(), hasMainChild: false } },
        { data: { source: parentId, target: newId.toString() } }
      ]);
      node.data('hasMainChild', true);
      addButton.disabled = true;
      customLayout();
    });

    const branchButton = document.createElement('button');
    branchButton.className = 'node-button';
    branchButton.innerText = '#';
    branchButton.addEventListener('click', () => {
      const parentId = node.id();
      const subNodes = cy.nodes().filter(n => n.id().startsWith(parentId + '.'));
      const subIndex = subNodes.length + 1;
      const newId = `${parentId}.${subIndex}`;
      cy.add([
        { data: { id: newId, title: newId, hasMainChild: false } },
        { data: { source: parentId, target: newId }, classes: 'branch' }
      ]);
      customLayout();
    });

    buttonsDiv.appendChild(addButton);
    buttonsDiv.appendChild(branchButton);
    div.appendChild(textarea);
    div.appendChild(buttonsDiv);
    document.body.appendChild(div);

    // Update position on pan/zoom
    node.on('position', () => {
      div.style.left = node.renderedPosition('x') - 100 + 'px';
      div.style.top = node.renderedPosition('y') - 50 + 'px';
    });

    cy.on('pan zoom', () => {
      div.style.left = node.renderedPosition('x') - 100 + 'px';
      div.style.top = node.renderedPosition('y') - 50 + 'px';
    });

    // Remove the div when the node is removed
    node.on('remove', () => {
      div.remove();
    });

    return div;
  }

  // Render HTML content for all nodes
  cy.nodes().forEach(node => renderNodeContent(node));

  // Add new nodes with HTML content
  cy.on('add', 'node', (evt) => {
    const node = evt.target;
    if (!document.querySelector(`.node-container[data-id="${node.id()}"]`)) {
      renderNodeContent(node);
    }
  });

  // Initial layout
  customLayout();
});
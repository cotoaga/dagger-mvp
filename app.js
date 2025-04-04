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
    console.log('Running customLayout');
    const nodes = cy.nodes();
    const mainThread = [];
    const subThreads = {};

    // Log viewport dimensions
    const viewportWidth = cy.width();
    const viewportHeight = cy.height();
    console.log(`Viewport: width=${viewportWidth}, height=${viewportHeight}`);

    // Organize nodes into main thread and sub-threads
    nodes.forEach(node => {
      const id = node.id();
      console.log(`Processing node ${id}`);
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
      const x = viewportWidth / 2;
      const y = 100 + index * 150;
      node.position({ x, y });
      console.log(`Positioning main thread node ${node.id()}: x=${x}, y=${y}`);
    });

    // Position sub-thread nodes to the right and below their parent
    Object.keys(subThreads).forEach(parentId => {
      const parent = cy.getElementById(parentId);
      const parentPos = parent.position();
      subThreads[parentId].forEach((subNode, index) => {
        const x = parentPos.x + 200 * (index + 1);
        const y = parentPos.y + 100;
        subNode.position({ x, y });
        console.log(`Positioning sub-thread node ${subNode.id()}: x=${x}, y=${y}`);
      });
    });
  }

  // Function to render node content (text field and buttons)
  function renderNodeContent(node) {
    console.log(`Rendering node content for ${node.id()}`);
    const div = document.createElement('div');
    div.className = 'node-container';
    div.setAttribute('data-id', node.id());
    div.style.position = 'absolute';
    const x = node.renderedPosition('x');
    const y = node.renderedPosition('y');
    console.log(`Node ${node.id()} rendered position: x=${x}, y=${y}`);
    if (x === undefined || y === undefined) {
      console.error(`Invalid position for node ${node.id()}`);
      return;
    }
    div.style.left = x - 100 + 'px';
    div.style.top = y - 50 + 'px';

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
    addButton.disabled = node.data('hasMainChild');
    addButton.addEventListener('click', () => {
      if (node.data('hasMainChild')) return;
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

    node.on('position', () => {
      div.style.left = node.renderedPosition('x') - 100 + 'px';
      div.style.top = node.renderedPosition('y') - 50 + 'px';
    });

    cy.on('pan zoom', () => {
      div.style.left = node.renderedPosition('x') - 100 + 'px';
      div.style.top = node.renderedPosition('y') - 50 + 'px';
    });

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

  // Run the layout
  customLayout();
  cy.fit();
  cy.center();

  // Log positions after layout
  cy.on('layoutstop', () => {
    console.log('Layoutstop event fired');
    cy.nodes().forEach(node => {
      console.log(`Node ${node.id()} position: x=${node.position('x')}, y=${node.position('y')}`);
      console.log(`Node ${node.id()} rendered position: x=${node.renderedPosition('x')}, y=${node.renderedPosition('y')}`);
    });
  });

  // Additional debug: Log node visibility
  cy.nodes().forEach(node => {
    console.log(`Node ${node.id()} visible: ${node.visible()}`);
    console.log(`Node ${node.id()} rendered: ${node.renderedBoundingBox()}`);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      { data: { id: 'root', text: 'paste your prompt in here; click "+" to add a node below to paste LLM\'s answer inside; click "#" to branch into a sub-thread' } }
    ],
    style: [
      {
        selector: 'node',
        style: {
          'width': '200px',
          'height': '100px',
          'background-color': 'transparent',
          'label': '', // We’ll use HTML for the label
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
    ],
    layout: { name: 'grid' }
  });

  // Function to render node content (text field and buttons)
  function renderNodeContent(node) {
    const div = document.createElement('div');
    div.className = 'node-container';
    div.style.position = 'absolute';
    div.style.left = node.renderedPosition('x') - 100 + 'px'; // Center the div
    div.style.top = node.renderedPosition('y') - 50 + 'px';

    const textarea = document.createElement('textarea');
    textarea.className = 'node-textarea';
    textarea.value = node.data('text') || '';
    textarea.addEventListener('input', (e) => {
      node.data('text', e.target.value);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'node-buttons';

    const addButton = document.createElement('button');
    addButton.className = 'node-button';
    addButton.innerText = '+';
    addButton.addEventListener('click', () => {
      const newId = `n${Date.now()}`;
      cy.add([
        { data: { id: newId, text: 'LLM\'s answer' } },
        { data: { source: node.id(), target: newId } }
      ]);
      cy.layout({ name: 'grid' }).run();
    });

    const branchButton = document.createElement('button');
    branchButton.className = 'node-button';
    branchButton.innerText = '#';
    branchButton.addEventListener('click', () => {
      const newId = `n${Date.now()}`;
      cy.add([
        { data: { id: newId, text: 'Sub-thread' } },
        { data: { source: node.id(), target: newId }, classes: 'branch' }
      ]);
      cy.layout({ name: 'grid' }).run();
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

  // Re-render on layout changes
  cy.on('layoutstop', () => {
    cy.nodes().forEach(node => {
      const div = document.querySelector(`.node-container[data-id="${node.id()}"]`);
      if (div) {
        div.style.left = node.renderedPosition('x') - 100 + 'px';
        div.style.top = node.renderedPosition('y') - 50 + 'px';
      }
    });
  });

  // Add new nodes with HTML content
  cy.on('add', 'node', (evt) => {
    const node = evt.target;
    if (!document.querySelector(`.node-container[data-id="${node.id()}"]`)) {
      renderNodeContent(node);
    }
  });
});
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
          'background-color': '#00FF99',
          'label': 'data(title)',
          'width': '50px',
          'height': '50px',
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#FFF'
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

  // Log the node's position after layout
  cy.on('layoutstop', () => {
    const node = cy.getElementById('1');
    console.log(`Node 1 position: x=${node.position('x')}, y=${node.position('y')}`);
    console.log(`Node 1 rendered position: x=${node.renderedPosition('x')}, y=${node.renderedPosition('y')}`);
  });
});
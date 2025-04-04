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
    ]
  });

  // Custom layout to position nodes
  function customLayout() {
    const nodes = cy.nodes();
    const mainThread = [];
    const subThreads = {};

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

    mainThread.forEach((node, index) => {
      const x = 200; // Center of viewport (adjust based on your screen width)
      const y = 100 + index * 150; // Start near the top
      node.position({ x, y });
      console.log(`Positioning main thread node ${node.id()}: x=${x}, y=${y}`);
    });

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

  customLayout();
});
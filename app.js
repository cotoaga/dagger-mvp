document.addEventListener('DOMContentLoaded', () => {
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      { data: { id: 'root', label: 'Chat with Grok' }, classes: 'grok' },
      { data: { id: 'n1', label: 'Subtopic Structure' }, classes: 'user' },
      { data: { id: 'n2', label: 'Diagram Choice' }, classes: 'user' },
      { data: { id: 'n3', label: 'DAG!' }, classes: 'grok' },
      { data: { id: 'n2.1', label: 'Mind Map' }, classes: 'grok' },
      { data: { source: 'root', target: 'n1' } },
      { data: { source: 'n1', target: 'n2' } },
      { data: { source: 'n2', target: 'n3' } },
      { data: { source: 'n2', target: 'n2.1' }, classes: 'branch' }
    ],
    style: [
      { selector: 'node.grok', style: { 'background-color': '#00FF99', 'label': 'data(label)', 'color': '#FFF' } },
      { selector: 'node.user', style: { 'background-color': '#FFCC00', 'label': 'data(label)', 'color': '#FFF' } },
      { selector: 'edge', style: { 'width': 2, 'line-color': '#FFF', 'target-arrow-shape': 'triangle' } },
      { selector: 'edge.branch', style: { 'line-style': 'dashed', 'line-color': '#CCC' } }
    ],
    layout: { name: 'grid' }
  });

  cy.on('tap', 'node', (evt) => {
    const newId = `n${Date.now()}`;
    cy.add([
      { data: { id: newId, label: 'New Branch' }, classes: 'grok' },
      { data: { source: evt.target.id(), target: newId }, classes: 'branch' }
    ]);
    cy.layout({ name: 'grid' }).run();
  });
});
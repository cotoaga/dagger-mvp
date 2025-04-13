// File: views/CytoscapeAdapter.js
/**
 * CytoscapeAdapter - Handles rendering the graph with Cytoscape.js
 * Bridge between GraphModel and Cytoscape visualization
 */
class CytoscapeAdapter {
  constructor(containerId, graphModel) {
    this.containerId = containerId;
    this.model = graphModel;
    this.cy = null;
    
    this.initialize();
  }
  
  initialize() {
    this.cy = cytoscape({
      container: document.getElementById(this.containerId),
      elements: this.convertModelToElements(),
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
    
    return this.cy;
  }
  
  convertModelToElements() {
    const elements = [];
    
    // Add nodes
    Object.entries(this.model.nodes).forEach(([id, data]) => {
      elements.push({
        data: { id, ...data }
      });
    });
    
    // Add edges
    this.model.edges.forEach(edge => {
      elements.push({
        data: {
          source: edge.source,
          target: edge.target
        },
        classes: edge.isMainThread ? '' : 'branch'
      });
    });
    
    return elements;
  }
  
  syncFromModel() {
    // Clear existing elements
    this.cy.elements().remove();
    
    // Add elements from model
    this.cy.add(this.convertModelToElements());
    
    return this.cy;
  }
  
  getNodeById(id) {
    return this.cy.getElementById(id);
  }
  
  addNode(nodeData) {
    this.cy.add({
      data: nodeData
    });
    
    return this.getNodeById(nodeData.id);
  }
  
  addEdge(sourceId, targetId, isMainThread = true) {
    const edge = {
      data: {
        source: sourceId,
        target: targetId
      }
    };
    
    if (!isMainThread) {
      edge.classes = 'branch';
    }
    
    this.cy.add(edge);
    return edge;
  }
  
  removeNode(id) {
    const node = this.getNodeById(id);
    if (node) {
      node.remove();
      return true;
    }
    return false;
  }
  
  getCytoscape() {
    return this.cy;
  }
}
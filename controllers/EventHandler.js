// File: controllers/EventHandler.js
/**
 * EventHandler - Coordinates user actions and model updates
 * Binds UI events to controller logic and model changes
 */
class EventHandler {
  constructor(model, cyAdapter, layoutManager, uiComponents) {
    this.model = model;
    this.cyAdapter = cyAdapter;
    this.layoutManager = layoutManager;
    this.uiComponents = uiComponents;
    
    this.bindEvents();
  }
  
  bindEvents() {
    const cy = this.cyAdapter.getCytoscape();
    
    // Render HTML content for all initial nodes
    cy.nodes().forEach(node => {
      const container = this.uiComponents.renderNodeContent(node);
      this.bindNodeEvents(node, container);
    });
    
    // Handle new nodes being added
    cy.on('add', 'node', (evt) => {
      const node = evt.target;
      if (!this.uiComponents.getNodeContainer(node.id())) {
        const container = this.uiComponents.renderNodeContent(node);
        this.bindNodeEvents(node, container);
      }
    });
  }
  
  bindNodeEvents(cytoscapeNode, container) {
    const id = cytoscapeNode.id();
    
    // Handle text editing
    const textarea = container.querySelector('.node-textarea');
    textarea.addEventListener('input', (e) => {
      const text = e.target.value;
      this.model.updateNodeData(id, { text });
    });
    
    // Handle add button (main thread)
    const addButton = container.querySelector('.add-button');
    addButton.addEventListener('click', () => {
      if (cytoscapeNode.data('hasMainChild')) return;
      
      const parentId = id;
      // If id is a number like "1", create "2". If it's a string, append a number
      const isNumeric = /^\d+$/.test(parentId);
      const newId = isNumeric ? (parseInt(parentId) + 1).toString() : parentId + 1;
      
      // Add to model
      this.model.addNode(newId, { title: newId, hasMainChild: false });
      this.model.addEdge(parentId, newId, true);
      
      // Update Cytoscape
      const newNode = this.cyAdapter.addNode({ id: newId, title: newId, hasMainChild: false });
      this.cyAdapter.addEdge(parentId, newId);
      
      // Update UI
      addButton.disabled = true;
      
      // Apply layout
      this.layoutManager.applyCustomLayout();
    });
    
    // Handle branch button (sub-thread)
    const branchButton = container.querySelector('.branch-button');
    branchButton.addEventListener('click', () => {
      const parentId = id;
      // Get existing sub-nodes to determine next index
      const subNodes = Object.keys(this.model.nodes)
        .filter(nodeId => nodeId.startsWith(parentId + '.'))
        .map(nodeId => parseInt(nodeId.split('.')[1]));
      
      const subIndex = subNodes.length > 0 ? Math.max(...subNodes) + 1 : 1;
      const newId = `${parentId}.${subIndex}`;
      
      // Add to model
      this.model.addNode(newId, { title: newId, hasMainChild: false });
      this.model.addEdge(parentId, newId, false);
      
      // Update Cytoscape
      const newNode = this.cyAdapter.addNode({ id: newId, title: newId, hasMainChild: false });
      this.cyAdapter.addEdge(parentId, newId, false);
      
      // Apply layout
      this.layoutManager.applyCustomLayout();
    });
    
    // Handle delete button
    const deleteButton = container.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      // Get descendants before removing
      const descendants = this.model.getNodeDescendants(id);
      
      // Remove from model
      this.model.removeNode(id);
      
      // Remove from cytoscape (descendants will be removed automatically via 'remove' event)
      this.cyAdapter.removeNode(id);
      
      // Apply layout
      this.layoutManager.applyCustomLayout();
    });
  }
}
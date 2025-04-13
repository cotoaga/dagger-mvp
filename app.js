// File: app.js (Main application)
/**
 * Main application entry point
 * Initializes and connects all components
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the model
  const graphModel = new GraphModel();
  
  // Add initial node if model is empty
  if (Object.keys(graphModel.nodes).length === 0) {
    graphModel.addNode('1', { title: '1' });
  }
  
  // Initialize Cytoscape adapter
  const cytoscapeAdapter = new CytoscapeAdapter('cy', graphModel);
  
  // Initialize layout manager
  const layoutManager = new LayoutManager(cytoscapeAdapter);
  
  // Initialize UI components
  const uiComponents = new UIComponents(graphModel);
  
  // Initialize state manager
  const stateManager = new StateManager(graphModel);
  
  // Try to load saved state
  const stateLoaded = stateManager.loadFromLocalStorage();
  
  // If state was loaded, sync Cytoscape
  if (stateLoaded) {
    cytoscapeAdapter.syncFromModel();
  }
  
  // Initialize event handler
  const eventHandler = new EventHandler(graphModel, cytoscapeAdapter, layoutManager, uiComponents);
  
  // Apply initial layout
  layoutManager.applyCustomLayout();
  
  // Set up auto-save
  setInterval(() => {
    stateManager.saveToLocalStorage();
  }, 10000); // Save every 10 seconds
  
  // Expose instances to console for debugging
  window.dagger = {
    model: graphModel,
    cyAdapter: cytoscapeAdapter,
    layoutManager: layoutManager,
    uiComponents: uiComponents,
    stateManager: stateManager,
    eventHandler: eventHandler
  };
});
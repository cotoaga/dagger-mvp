// File: controllers/LayoutManager.js
/**
 * LayoutManager - Handles node positioning and layouts
 * Provides different layout algorithms and configurations
 */
class LayoutManager {
  constructor(cytoscapeAdapter) {
    this.cyAdapter = cytoscapeAdapter;
  }
  
  applyCustomLayout() {
    console.log('Running customLayout');
    const cy = this.cyAdapter.getCytoscape();
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

    // Sort main thread nodes numerically
    mainThread.sort((a, b) => {
      const aNum = parseInt(a.id());
      const bNum = parseInt(b.id());
      return aNum - bNum;
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
      if (!parent.length) return; // Skip if parent doesn't exist
      
      const parentPos = parent.position();
      
      // Sort sub-threads by their second number
      subThreads[parentId].sort((a, b) => {
        const aIndex = parseInt(a.id().split('.')[1]);
        const bIndex = parseInt(b.id().split('.')[1]);
        return aIndex - bIndex;
      });
      
      subThreads[parentId].forEach((subNode, index) => {
        const x = parentPos.x + 250;
        const y = parentPos.y + 75 * (index + 1);
        subNode.position({ x, y });
        console.log(`Positioning sub-thread node ${subNode.id()}: x=${x}, y=${y}`);
      });
    });
    
    // Center and fit the graph
    cy.fit();
    cy.center();
  }
  
  applyGridLayout() {
    const cy = this.cyAdapter.getCytoscape();
    const layout = cy.layout({
      name: 'grid',
      rows: 3
    });
    
    layout.run();
  }
}
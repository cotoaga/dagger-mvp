// File: views/UIComponents.js
/**
 * UIComponents - Manages HTML overlays for nodes
 * Creates and updates text fields, buttons, and other UI elements
 */
class UIComponents {
  constructor(graphModel) {
    this.model = graphModel;
    this.nodeContainers = {};
  }
  
  renderNodeContent(cytoscapeNode) {
    const id = cytoscapeNode.id();
    console.log(`Rendering node content for ${id}`);
    
    // Remove existing container if it exists
    if (this.nodeContainers[id]) {
      this.nodeContainers[id].remove();
    }
    
    const div = document.createElement('div');
    div.className = 'node-container';
    div.setAttribute('data-id', id);
    div.style.position = 'absolute';
    
    // Position the container
    const updatePosition = () => {
      const x = cytoscapeNode.renderedPosition('x');
      const y = cytoscapeNode.renderedPosition('y');
      if (x !== undefined && y !== undefined) {
        div.style.left = x - 100 + 'px';
        div.style.top = y - 50 + 'px';
      }
    };
    
    updatePosition();
    
    // Get node data
    const nodeData = this.model.getNodeData(id);
    
    // Add node title/ID at top
    const titleDiv = document.createElement('div');
    titleDiv.className = 'node-title';
    titleDiv.innerText = nodeData.title || id;
    
    // Create textarea for content
    const textarea = document.createElement('textarea');
    textarea.className = 'node-textarea';
    textarea.value = nodeData.text || nodeData.title || '';
    
    // Create buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'node-buttons';
    
    // Add main thread button
    const addButton = document.createElement('button');
    addButton.className = 'node-button add-button';
    addButton.innerText = '+';
    addButton.disabled = nodeData.hasMainChild;
    
    // Add branch button
    const branchButton = document.createElement('button');
    branchButton.className = 'node-button branch-button';
    branchButton.innerText = '#';
    
    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'node-button delete-button';
    deleteButton.innerText = '-';
    
    // Add buttons to container
    buttonsDiv.appendChild(addButton);
    buttonsDiv.appendChild(branchButton);
    buttonsDiv.appendChild(deleteButton);
    
    // Assemble the node container
    div.appendChild(titleDiv);
    div.appendChild(textarea);
    div.appendChild(buttonsDiv);
    
    // Add to document
    document.body.appendChild(div);
    
    // Store reference to container
    this.nodeContainers[id] = div;
    
    // Update position when node position changes
    cytoscapeNode.on('position', updatePosition);
    
    // Update position when graph is panned or zoomed
    cytoscapeNode.cy().on('pan zoom', updatePosition);
    
    // Remove container when node is removed
    cytoscapeNode.on('remove', () => {
      if (this.nodeContainers[id]) {
        this.nodeContainers[id].remove();
        delete this.nodeContainers[id];
      }
    });
    
    return div;
  }
  
  getNodeContainer(id) {
    return this.nodeContainers[id];
  }
  
  updateNodeText(id, text) {
    const container = this.nodeContainers[id];
    if (container) {
      const textarea = container.querySelector('.node-textarea');
      if (textarea) {
        textarea.value = text;
      }
    }
  }
  
  removeAllNodeContainers() {
    Object.values(this.nodeContainers).forEach(container => {
      container.remove();
    });
    this.nodeContainers = {};
  }
}
// File: models/GraphModel.js
/**
 * GraphModel - Manages the graph data structure
 * Responsible for nodes, edges, and their relationships
 */
class GraphModel {
  constructor() {
    this.nodes = {};
    this.edges = [];
  }

  addNode(id, data = {}) {
    if (!id) throw new Error('Node ID is required');
    
    // Set defaults if not provided
    const nodeData = {
      title: data.title || id,
      text: data.text || '',
      hasMainChild: data.hasMainChild || false,
      timestamp: data.timestamp || new Date().toISOString(),
      ...data
    };
    
    this.nodes[id] = nodeData;
    return nodeData;
  }
  
  getNodeData(id) {
    return this.nodes[id];
  }
  
  updateNodeData(id, data) {
    if (!this.nodes[id]) return false;
    
    this.nodes[id] = {
      ...this.nodes[id],
      ...data
    };
    
    return true;
  }
  
  addEdge(sourceId, targetId, isMainThread = true) {
    if (!this.nodes[sourceId] || !this.nodes[targetId]) {
      throw new Error('Source or target node does not exist');
    }
    
    const edge = {
      source: sourceId,
      target: targetId,
      isMainThread
    };
    
    this.edges.push(edge);
    
    // Update source node to indicate it has a main child if this is a main thread edge
    if (isMainThread) {
      this.nodes[sourceId].hasMainChild = true;
    }
    
    return edge;
  }
  
  getNodeDescendants(nodeId) {
    const descendants = [];
    const visited = new Set();
    
    const findDescendants = (id) => {
      visited.add(id);
      
      this.edges.forEach(edge => {
        if (edge.source === id && !visited.has(edge.target)) {
          descendants.push(edge.target);
          findDescendants(edge.target);
        }
      });
    };
    
    findDescendants(nodeId);
    return descendants;
  }
  
  removeNode(nodeId) {
    // Get all descendants (including deeply nested ones)
    const descendants = this.getNodeDescendants(nodeId);
    
    // Remove the node and all its descendants
    delete this.nodes[nodeId];
    descendants.forEach(id => delete this.nodes[id]);
    
    // Remove any edges connected to the node or its descendants
    const nodesToRemove = [nodeId, ...descendants];
    this.edges = this.edges.filter(edge => 
      !nodesToRemove.includes(edge.source) && !nodesToRemove.includes(edge.target)
    );
    
    // Update parent node's hasMainChild flag if needed
    const parentEdge = this.edges.find(edge => edge.target === nodeId && edge.isMainThread);
    if (parentEdge) {
      // Check if parent still has any main thread children
      const parentHasOtherMainChildren = this.edges.some(edge => 
        edge.source === parentEdge.source && 
        edge.isMainThread && 
        edge.target !== nodeId
      );
      
      if (!parentHasOtherMainChildren) {
        this.nodes[parentEdge.source].hasMainChild = false;
      }
    }
    
    return true;
  }
  
  exportData() {
    return {
      nodes: { ...this.nodes },
      edges: [...this.edges]
    };
  }
  
  importData(data) {
    if (data && data.nodes && data.edges) {
      this.nodes = { ...data.nodes };
      this.edges = [...data.edges];
      return true;
    }
    return false;
  }
}
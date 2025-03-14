
class PatriciaNode {
    constructor(prefix = '') {
      this.prefix = prefix;
      this.children = new Map(); // Key: first character of child's prefix, Value: PatriciaNode
      this.urls = new Set();
    }
  
    isTerminal() {
      return this.urls.size > 0;
    }
  }
  
  class PatriciaTrie {
    constructor() {
      this.root = new PatriciaNode();
      this.allTags = new Set(); // Keep track of all unique tags added
    }
  
    addIfMissing(string, url) {
      let node = this._getOrCreateNodesForString(string);
      if (!node.urls.has(url)) {
        node.urls.add(url);
        // Add to allTags if not present
        if (this.allTags.has(string)) {
          return true; // URL was new, but tag already existed
        } else {
          this.allTags.add(string);
          return true;
        }
      }
      return false;
    }
  
    _getCommonPrefixLength(str, index, prefix) {
      let common = 0;
      const maxLen = Math.min(prefix.length, str.length - index);
      while (common < maxLen && str[index + common] === prefix[common]) {
        common++;
      }
      return common;
    }
  
    _getOrCreateNodesForString(string) {
      let currentNode = this.root;
      let index = 0;
  
      while (index < string.length) {
        const currentChar = string[index];
        if (!currentNode.children.has(currentChar)) {
          // Create new terminal node
          const newNode = new PatriciaNode(string.slice(index));
          currentNode.children.set(currentChar, newNode);
          return newNode;
        }
  
        const childNode = currentNode.children.get(currentChar);
        const commonLength = this._getCommonPrefixLength(
          string,
          index,
          childNode.prefix
        );
  
        // Check if we need to split the current node
        if (commonLength < childNode.prefix.length) {
          // Split needed: create intermediate node
          const prefixBeforeSplit = childNode.prefix.slice(0, commonLength);
          const prefixAfterSplit = childNode.prefix.slice(commonLength);
  
          const intermediateNode = new PatriciaNode(prefixBeforeSplit);
          currentNode.children.set(currentChar, intermediateNode);
  
          // Move existing child to the new intermediate node
          childNode.prefix = prefixAfterSplit;
          const nextChar = prefixAfterSplit[0];
          intermediateNode.children.set(nextChar, childNode);
  
          currentNode = intermediateNode;
        } else {
          // No split needed, move down
          currentNode = childNode;
        }
  
        index += commonLength;
      }
  
      return currentNode; // Current node is terminal for this string
    }
  
    search(query) {
      const wildcardIndex = query.indexOf('*');

      if (wildcardIndex === -1) {
        const node = this._findExactNode(query);
        return node ? [...node.urls] : [];
      } else {
        const prefix = query.slice(0, wildcardIndex);
        const baseNode = this._findExactNode(prefix);

        if (!baseNode) return [];
        // Collect all URLs recursively from the subtree
        return this._collectUrls(baseNode);
      }
    }
  
    _findExactNode(string) {
      let currentNode = this.root;
      let index = 0;
  
      while (index < string.length) {
        const currentChar = string[index];
        if (!currentNode.children.has(currentChar)) return null;
  
        const childNode = currentNode.children.get(currentChar);
        const commonLength = this._getCommonPrefixLength(
          string,
          index,
          childNode.prefix
        );
  
        currentNode = childNode;
        index += commonLength;
      }

      return currentNode.isTerminal() ? currentNode : null;
    }
  
    _collectUrls(node) {
      const urls = [];
      if (node.urls.size > 0) {
        urls.push(...node.urls);
      }
      for (const child of node.children.values()) {
        urls.push(...this._collectUrls(child));
      }
      return [...new Set(urls)]; // Ensure unique URLs
    }
  
    remove(string, url) {
      const node = this._findExactNode(string);
      if (!node || !node.urls.has(url)) return false;
      
      node.urls.delete(url);
      // Do not compress trie even if urls become empty
      return true;
    }
  
    getAllTags() {
      return Array.from(this.allTags);
    }
  }
  
  module.exports = PatriciaTrie;

#creating a TreeNode class and defining an init function with two nodes: left and right
class TreeNode:
   def __init__(self, data, left = None, right = None):#initalize the tree node with the first element
      self.data = data
      self.left = left
      self.right = right

#add elements to the tree using the queue data structure 
def insert(temp,data):
   que = []
   que.append(temp)
   while (len(que)):
      temp = que[0]
      que.pop(0)
      if (not temp.left):
         if data is not None:
            temp.left = TreeNode(data)
         else:
            temp.left = TreeNode(0)
         break
      else:
         que.append(temp.left)
      if (not temp.right):
         if data is not None:
            temp.right = TreeNode(data)
         else:
            temp.right = TreeNode(0)
         break
      else:
         que.append(temp.right)

#create a tree 
def make_tree(elements):
   Tree = TreeNode(elements[0])
   for element in elements[1:]:
      insert(Tree, element)
   return Tree

#solution class to determine the maximum depth of a binary tree
class Solution(object):
   def maxDepth(self, root):
      return self.solve(root)
   def solve(self,root,depth = 0):
      if root == None:
         return depth
      return max(self.solve(root.left,depth+1),self.solve(root.right,depth+1))
   

if __name__ == "__main__":
   # Test case - 1
    tree3 = make_tree([3,9,20,None,None,15,7])
    ob3 = Solution()
    print(ob3.maxDepth(tree3))
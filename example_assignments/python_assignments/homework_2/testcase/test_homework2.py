import unittest
from homework_2 import (Solution, make_tree)
from grade_decorator import score

class TestHomework2(unittest.TestCase):
    @score(10)
    def test_max_depth_1(self):
        tree = make_tree([3,9,20,None,None,15,7])
        ob3 = Solution()
        self.assertEqual(3, ob3.maxDepth(tree)) 
    
    @score(10)
    def test_max_depth_2(self):
        tree2 = make_tree([1,None,2])
        ob2 = Solution()
        self.assertEqual(3, ob2.maxDepth(tree2))

    @score(10)
    def test_max_depth_3(self):
        tree1 = make_tree([1,2,2,3,4,None,3])
        ob1 = Solution()
        self.assertEqual(2, ob1.maxDepth(tree1))
import unittest
import os
from utils.test_runner import CustomTestRunner  

if __name__ == "__main__": 
    #Setting entry directory to /build/run/tests
    test_directory = os.path.join(os.path.dirname(__file__), "tests")
    suite = unittest.defaultTestLoader.discover(test_directory) 
    runner = CustomTestRunner("output.txt", "error.txt")
    runner.run(suite)

    
    
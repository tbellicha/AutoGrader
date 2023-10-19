import unittest
from code.homework_1 import Calculator

class TestHomework1(unittest.TestCase): 
    def setUp(self):
        self.calc = Calculator()

    def test_addition(self): 
        self.assertEqual(self.calc.addition(2, 3), 5) 
        self.assertEqual(self.calc.addition(3, 3), 6) 

    def test_addition_invalid_input(self):
        with self.assertRaises(TypeError):
            self.calc.addition(2, "3")
    
    #Will fail because it'll concantenate into "23" intead of throwing TypeError
    def test_addition_strings(self):
        with self.assertRaises(TypeError):
            self.calc.addition("2", "3")

    #Will fail because we expect TypeError for blank string addition
    """
    Teacher expects student to handle input validation of the parameters, 
    so we test in this case the addition of two empty strings.
    Python has string concantenation and will add any two strings together ex: "3" + "2" = "32"
    so we expect students to check if the type of the parameters is appropriate and to raise a 
    TypeError when its false
    """
    def test_addition_blank_inputs(self):
        with self.assertRaises(TypeError):
            self.calc.addition("", "")

    def test_subtraction(self):
        result = self.calc.subtraction(2, -3)
        self.assertEqual(result, -1)   

    def test_subtraction_strings(self):
        with self.assertRaises(TypeError):
            self.calc.subtraction(2, "3")        

    def test_multiplication(self):
        result = self.calc.multiplication(2, 3)
        self.assertEqual(result, 6)

    def test_division(self):
        result = self.calc.division(6, 3)
        self.assertEqual(result, 2)
    
    def test_division_zero_denom(self):
        with self.assertRaises(ValueError):
            self.calc.division(2, 0)

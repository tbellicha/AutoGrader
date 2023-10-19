class Calculator:
    def addition(self, a, b): 
        return a + b 
    
    def subtraction(self, a, b): 
        return a - b

    def multiplication(self, a, b):
        return a * b

    def division(self, a, b): 
        if b > 0:
            return a / b
        else: 
            raise ValueError 
    
if __name__ == "__main__":
    calc = Calculator()
    print(calc.addition(2, 3))
    print(calc.subtraction(2, 3))
    print(calc.multiplication(2, 3))
    print(calc.division(2, 3)) 
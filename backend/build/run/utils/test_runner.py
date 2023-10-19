import unittest
import json
import time

class CustomTextResult(unittest.TextTestResult):
    def __init__(self, output_file, error_file, results, stream, descriptions, verbosity):
        super().__init__(stream, descriptions, verbosity)
        self.output_file = output_file
        self.error_file = error_file
        self.results = results 

    def addSuccess(self, test):
        super().addSuccess(test) 
        testDetails = test.id().split(".")
        data = {
            "name": testDetails[0],
            "case": testDetails[2],
            "result": True
        }
        
        return self.results.append(data)

    def addError(self, test, err):
        super().addError(test, err) 
        testDetails = test.id().split(".")
        data = {
            "name": testDetails[0],
            "case": testDetails[2],
            "result": False
        } 

        return self.results.append(data)
    
    def addFailure(self, test, err):
        super().addFailure(test, err) 
        testDetails = test.id().split(".")
        data = {
            "name": testDetails[0],
            "case": testDetails[2],
            "result": False
        }
        
        return self.results.append(data)

class CustomTestRunner(unittest.TextTestRunner):
    resultclass = CustomTextResult
    
    def __init__(self, output_file, error_file, descriptions=True, verbosity=1):
        super().__init__(descriptions=True, verbosity=verbosity) 
        self.output_file = output_file
        self.error_file = error_file
        self.json_output = {
            "tests": []
        }

    def _makeResult(self):
        return self.resultclass(self.output_file, self.error_file, self.json_output["tests"], self.stream, self.descriptions, self.verbosity)

    def run(self, test):
        #print(test)
        result = self._makeResult()
        #print(result.startTestRun())
        startTime = time.time()
        try:
            test(result)
        finally:
            endTime = time.time()
        #print(f"Time taken: {endTime - startTime}") 
 
        json_data = json.dumps(self.json_output)
        #print(self.json_output)
        print(json_data)

        """with open("result.json", 'w') as file:
            json.dump(self.json_output, file)
            file.write("\n")"""

        #return result

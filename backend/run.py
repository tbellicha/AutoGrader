import docker
import sys
import os 

"""
Docker sdk wrapper that sets file path to docker, builds image based on the docker file, runs the container, and returns the output
"""
class DockerClient:
    def __init__(self, lang):
        self.type = lang 
        self.file_path = None
        self.current_image = None
        self.logs = None
        self.client = docker.from_env()
        self.detect_image_type()

    """
    Set file path to dockerfile based on the language provided 
    """
    def detect_image_type(self):
        if self.type == 'py':  
            self.file_path = "Dockerfile-python"  
        elif self.type == 'js':
            self.file_path = "Dockerfile-js"
        elif self.type == 'java':
            self.file_path = "Dockerfile-java"
        elif self.type == 'cpp':
            self.file_path = "Dockerfile-cpp"
    
    """
    Create a specific image for the language provided
    """ 
    def build_image(self):
        
        try:
            #Build the image based on the language provided to the client
            self.current_image, self.logs = self.client.images.build(path="./build", dockerfile=self.file_path)
            """
            for logs in self.logs:
                print(logs)
            """
        except docker.errors.BuildError as e: 
            print(f'Raised exception: {e}')
            #Exit the script if image cannot be built, coordinate w/ frontend on what kind of response.
            sys.exit(1)
    
    def run(self): 
        #Build the image before running container
        self.build_image()   
        
        if self.current_image is not None:
            try:
                #Run container, enable auto removal after container process ends, and decode the results of the test scripts 
                result = self.client.containers.run(self.current_image, auto_remove=True).decode('utf-8')

                #Json output, can be returned back to node js backend, can also update database by adding that functionality in this script
                print(result)
                
            except Exception as e:
                print(f"Raised exception when running client.containers.run(): {e}")
        
#Entry point of autograder process, docker wrapper that builds image, runs container, returns output to node backend 
if __name__ == "__main__":
    #Arugment passed to script
    lang = sys.argv[1]

    #Initialize client based on language of student submitted code
    client = DockerClient(lang)
    
    #Builds and runs the container
    client.run()

    #Printing result which is captured by stdout in node backend
    #print(result)
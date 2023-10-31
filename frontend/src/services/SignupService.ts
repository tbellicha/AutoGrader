import httpCommon from "../http-common";

const signup = async (email: string, password: string) : Promise<any> => {

    const signupRequest: SignupRequest = {
        email,
        password,
    };

    const parsedRequest: string = JSON.stringify(signupRequest);

    return await httpCommon.post("/api/signup/student", parsedRequest);
};

const SignupService = {
  signup,
};

export default SignupService;
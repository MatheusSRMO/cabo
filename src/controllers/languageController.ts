import { languages } from "../config/consts"
import languageService from "../services/languageService"
import { Request, Response } from "express"


class LanguageController {

    async runCode(request: Request, response: Response) {
        const { language, code, input } = request.body

        try {
            const result = await languageService.runCode({ language, code, input })
            return response.status(200).json(result)
        } catch (error) {
            return response.status(error.status).json(error)
        }
    }

    async list(request: Request, response: Response) {
        const body = []

        for(const language of languages) {
            body.push({
                language,
                info: await languageService.getInfo(language),
            })
        }

        return response.status(200).json(body)
    }
}

export default new LanguageController();

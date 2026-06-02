import config from "../config.js";
import { claudeClient } from "../llm/claudeClient.js";
import { Message } from "../types.js";

export class Conversarion {

    private messages : Message[] = [];
    private systemPrompt : string;
    private totalInputsTokens : number = 0;
    private totalOutputsTokens : number = 0;
    
    constructor(systemPrompt : string){
        this.systemPrompt = systemPrompt
    }

    addUserMessage(text: string): void {
        this.messages.push({
            role:"user",
            content:text
        });
    }
    
    addAssistantMessage(text: string): void {
        this.messages.push({
            role:"assistant",
            content:text
        });
    }

    async send(): Promise<string>{
        const response = await this._createMesagges();
      
        this._setTokens( response.usage.input_tokens, response.usage.output_tokens );

        const textBlock = response.content.find((block) => block.type === "text");

        if(!textBlock || textBlock.type !== "text") throw new Error("Claude no retorno un bloque de texto en la respuesta");

        const responseText = textBlock.text;

        this._addAssistantMessage(textBlock.text);

        return responseText;
    }

    clear(): void {
        this.messages = [];
        this.totalInputsTokens = 0;
        this.totalOutputsTokens = 0;
        console.log("Conversacion reiniciada"); 
    }

    getTurnCount(): number {
        return Math.floor(this.messages.length / 2) ;
    }

    estimateCurrentTokens(): number {
        const totalChars = this.messages.reduce((sum, msg) => sum + msg.content.length , 0 );
        return Math.floor(totalChars / 2) ;
    }

    getStats():{ inputTokens : number ; outputTokens: number; turns: number }{
        return {
            inputTokens: this.totalInputsTokens,
            outputTokens: this.totalOutputsTokens,
            turns: this.getTurnCount()
        }
    }

    getHistory(): Message[] {
        return [...this.messages];
    }


    async _createMesagges(){
        return await claudeClient.messages.create({
            model: config.anthropicModel,
            max_tokens: 1024,
            ...( this.systemPrompt && {system: this.systemPrompt}),
            messages: this.messages
        });
    }

    _setTokens(totalInputs : number ,totalOutputs: number ){
        this.totalInputsTokens += totalInputs;
        this.totalOutputsTokens += totalOutputs;
    }

    _addAssistantMessage(text : string){
        this.addAssistantMessage(text); 
    }

   

}
export default class Hashing {
    #argon2

    constructor(pArgon2){
        this.#argon2 = pArgon2;
    }

    async criandoHash(senha) {
        const hash = await this.#argon2.hash(
            senha, 
            {
                type: this.#argon2.argon2id, // Tipo de hash que o algoritimo fará
                memoryCost: 2 ** 16, // Uso de Mémoria que será usado durante o processo de criação do hash
                timeCost: 5, // Numero de vezes que o algoritimo de hash irá iterar sobre a senha
                parallelism: 1 // Uso de threads que o algoritimo irá usar para a criação do hash
            }
        );

        return hash; // Depois de criado o hash é retornado
    }

    async verificaHash(hash, senha) {
        try {
            return await this.#argon2.verify(hash, senha);
        } catch (error) {
            return false ;
        }
    }
}

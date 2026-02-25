import { argon2d } from "argon2";

export class Hashing {
    static async criandoHash(senha) {
        const hash = await argon2d.hash(
            senha, 
            {
                type: argon2d.argon2id, // Tipo de hash que o algoritimo fará
                memoryCost: 2 ** 16, // Uso de Mémoria que será usado durante o processo de criação do hash
                timeCost: 5, // Numero de vezes que o algoritimo de hash irá iterar sobre a senha
                parallelism: 1 // Uso de threads que o algoritimo irá usar para a criação do hash
            }
        );

        return hash; // Depois de criado o hash é retornado
    }

    static async verificaHash(hash, senha) {
        try {
            return await argon2d.verify(hash, senha);
        } catch (error) {
            return false ;
        }
    }
}
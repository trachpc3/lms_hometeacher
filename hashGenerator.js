import bcrypt from "bcryptjs";

const generarHash = async () => {
    const passwordPlano = "Hometeacher@25";   // Aquí pones la contraseña en texto plano
    const hash = await bcrypt.hash(passwordPlano, 10);

    console.log(`Contraseña original: ${passwordPlano}`);
    console.log(`Hash generado: ${hash}`);
};

generarHash();

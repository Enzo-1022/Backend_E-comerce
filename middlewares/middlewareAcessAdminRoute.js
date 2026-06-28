export default function middlewareAcessAdminRoute(req, res, next) {
    try {
        if (req.IsAdim) {
            return next();
        }

        return res.status(403).json({Message: "Usuário Não Possui Acesso!"})
    } catch (error) {
        console.error(error);

        return res.status(500).json({Erro: "Erro Interno do Servidor"})
    }
}

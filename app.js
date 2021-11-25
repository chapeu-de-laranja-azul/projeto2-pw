const express = require("express");
const app = express();
const port = 9091;
const moment = require("moment");
const handlebars = require("express-handlebars");
const Aluno = require('./models/Aluno');

app.engine("handlebars", handlebars({
    dafaultLayout: 'main',
    helpers:{
        formatDate: (date) =>{
            return moment(date).format('DD/MM/YYYY')
        } 
    }
}))
app.set('view engine', "handlebars");


app.use(express.urlencoded({extend: true}));
app.use(express.json());


app.get("/", (req, res) => {
    Aluno.findAll().then((alunos) => {
        res.render('home', {alunos: alunos})
    })

})
app.get("/cadastro", (req, res) => {
    res.render('cadastroAluno')
})
app.post("/criar_cadastro", (req, res) => {
    Aluno.create({
        nome: req.body.nome,
        sobreNome: req.body.sobreNome,
        email: req.body.email,
        profissao: req.body.profissao,
        idade: req.body.idade
    }).then(() => {
        res.redirect('/')
    }).catch((erro) => {
        res.send(`Erro ao cadastrar aluno: ${erro}`)
    })
})
//Editar
app.get('/editar/:id', (req, res) => {
    id = req.params.id
    res.render('editar')
})
app.post('/editar', (req, res) =>{
    Aluno.update({ 
        nome: req.body.nome,
        sobreNome: req.body.sobreNome,
        email: req.body.email,
        profissao: req.body.profissao,
        idade: req.body.idade
    },{
        where: {id: id},
    }).then(()=>{
        res.redirect('/')
    }).catch((erro) => {
        console.log(`Erro ao editar: ${erro}`)
    })
})
//Exclusão
app.get('/deletar/:id', (req, res) => {
    Aluno.destroy({
        where: {'id': req.params.id}
    }).then(()=>{
        res.redirect('/')
        console.log('registro excluido com sucesso!')
    }).catch((erro) =>{
        console.log(`Erro ao excluir registro: ${erro}`)
    })
})


app.listen(port, ()=>{
    console.log(`Servidor rodando.`)
});
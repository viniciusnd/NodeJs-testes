/* eslint-disable no-console */

import { afterEach, describe, expect, it, test, jest } from '@jest/globals'
import app from '../../app.js'
import request from 'supertest'

let server

beforeEach(() => {
    const port = 3000
    server = app.listen(port)
})

afterEach(() => {
    server.close()
})

describe('GET em /editoras', () => {
    it('Deve retornar uma lista de editoras', async () => {
        const resposta = await request(app)
            .get('/editoras')
            .set('Accept', 'application/json')
            .expect('content-type', /json/)
            .expect(200)

        expect(resposta.body[0].email).toEqual('m@m.com')
    })
})

let idResposta
describe('POST em /editoras', () => {
    it('Deve adicionar uma nova editora', async () => {
        const resposta = await request(app)
            .post('/editoras')
            .send({
                nome: 'CDC',
                cidade: 'São Paulo',
                email: 's@s.com'
            })
            .expect(201)
        idResposta = resposta.body.content.id
    })

    it('Deve não adicionar nada ao passar pelo body vazio', async () => {
        await request(app)
        .post('/editoras')
        .send({})
        .expect(400)
    })
    
})

describe('GET em /editoras/id', () => {
    it('Deve retornar o recurso selecionado', async () => {
        await request(app)
            .get(`/editoras/${idResposta}`)
            .expect(200)

    })
})

describe('PUT em /editoras/id', () => {
    test.each([
        ['nome', { nome: 'Casa do código' }],
        ['cidade', { cidade: 'São José dos Campos' }],
        ['email', { email: 'cdc@cdc.com' }],
    ])('Deve alterar o campo %s', async (chave, param) => {

        const requisicao = { request }
        const spy = jest.spyOn(requisicao, 'request')
        await requisicao.request(app)
            .put(`/editoras/${idResposta}`)
            .send(param)
            .expect(204)

        expect(spy).toHaveBeenCalled()
    })
})

describe('DELETE em /editoras/id', () => {
    it('Deletar o recurso adicionado', async () => {
        await request(app)
            .delete(`/editoras/${idResposta}`)
            .expect(200)

    })
})




import request from 'supertest'
import {app} from "../../src";

describe('/blogs', () =>
{
    beforeAll(async () =>{
        await request(app)
            .delete('/blogs/all-data')
            .expect(204)
    });

    it('return 200 with empty array', async () => {

        await request(app)
            .get('/blogs')
            .expect(200,{ page: 1, pagesCount: 1, pageSize: 10, totalCount: 0, items: [] });

    });

    it('return 404 fot not blog with id', async () =>{
        await request(app)
            .get('/blog/:123')
            .expect(404);
    });


    it('return 404 if incorrect value', async () =>{
        await request(app)
            .post('/blog')
            .send({id: 'sdfsdf',
                name: 'string',
                description: 'string',
                websiteUrl: 'string',
                createdAt: 'string'
                , isMembership: false})
        .expect(404)
    });



});
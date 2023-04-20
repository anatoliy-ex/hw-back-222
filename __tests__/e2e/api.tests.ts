import request from 'supertest'
import {app} from "../../src";
import {runDb} from "../../src/dataBase/db.posts.and.blogs";

describe('/blogs', () =>
{
    //delete all
    beforeAll(async () =>{
        await runDb()
        await request(app)
            .delete('/blogs/all-data')
            .expect(204)
    });

    it('return 200 with empty array', async () => {

        await request(app)
            .get('/blogs')
            .expect(200,{ page: 1, pagesCount: 1, pageSize: 10, totalCount: 0, items: [] });
    });

    //get blogs by ID(error)
    it('return 404 fot not blog with id', async () =>{
        await request(app)
            .get('/blog/:123')
            .expect(404);
    });

    let createResponseBlog : any;

    //create new blogs(error)
    it('return 201 with new blog', async () =>{
        createResponseBlog = await request(app)
            .post('/blogs')
            .send({
                name: 'Tolik',
                description: 'Love incubator',
                websiteUrl: 'https://www.tolikkuzko.com'
            })
            .set({Authorization : "Basic YWRtaW46cXdlcnR5"})
            .expect(201)
    });

    //create new blogs(error)
    it('return 400 if incorrect value', async () =>{
        await request(app)
            .post('/blogs')
            .send({
                name: 'Tolik',
                description: 'Love incubator',
                websiteUrl: 1,
            })
            .set({Authorization : "Basic YWRtaW46cXdlcnR5"})
            .expect(400)
    });

    //create new blogs
    it('return 401 not authorization', async () =>{
        await request(app)
            .post('/blogs')
            .send({
                name: 'Tolik',
                description: 'Love incubator',
                websiteUrl: 'https://www.tolikkuzko.com'
            })
            .expect(401)
    });

    //get blogs by ID
    it('return 200 blog with id', async () =>{
        const blog = await request(app)
            .get( "/blogs/" + createResponseBlog.body.id)
        expect(blog.body).toStrictEqual({
            "id": expect.any(String),
            "name": "Tolik",
            "description": "incubator",
            "websiteUrl": "https://www.tolikkuzko.com",
            "createdAt" : expect.any(String),
            "isMembership" : false
        })
    });
});
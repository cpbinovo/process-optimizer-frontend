import { createMocks } from 'node-mocks-http'
import handleExperimentId from '../../../pages/api/experiment/[id]'
import path from 'path'
import fs from 'fs'
import rimraf from 'rimraf'

const tmpFolderPrefix = 'boost-tests-'

describe('/api/experiment/[id]', () => {

  afterEach(() => {
    rimraf.sync(`${tmpFolderPrefix}*`)
  });

  test('Returns experiment specified by id path element', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: 'myId123',
      }
    });

    handleExperimentId(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: 'myId123',
      }),
    );

  });

  test('PUT stores experiment', () => {
    var { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: 'newID'
      }
    });
    req._setBody(JSON.stringify({
      id: 'newID',
      payload: 'testPayload'
    }));

    handleExperimentId(req, res);

    expect(res._getStatusCode()).toBe(200);

    var { req, res } = createMocks({
      method: 'GET',
      query: {
        id: 'newID',
      }
    });

    handleExperimentId(req, res);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        payload: 'testPayload',
      }),
    );


  });

  test('PUT stores experiment as file', () => {
    var { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: 'newID'
      }
    });
    req._setBody(JSON.stringify({
      id: 'newID',
      payload: 'testPayload'
    }));
    process.env.DB_FOLDER=fs.mkdtempSync(tmpFolderPrefix)
    console.log(process.env.DB_FOLDER)

    handleExperimentId(req, res);

    expect(res._getStatusCode()).toBe(200);
    

    const outputFolder = process.env.DB_FOLDER;
    const expectedFileName = path.join(outputFolder, 'newId.json')
    expect(fs.accessSync(expectedFileName, fs.constants.R_OK)).toBeTruthy

  });

});
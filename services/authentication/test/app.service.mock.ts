export class AppServiceMock {
  getStatus() {
    return {
      serviceName: 'testServiceName',
      serviceInstance: 0,
      gitHash: 'testGitHash',
      version: 'testVersion'
    };
  }
}

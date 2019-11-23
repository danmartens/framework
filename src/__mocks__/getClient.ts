let nextResult = {
  rows: []
};

function getClient() {
  return Promise.resolve({
    query: () => {
      const result = nextResult;

      nextResult = {
        rows: []
      };

      return Promise.resolve(result);
    }
  });
}

getClient.__setNextResult = (result: any) => {
  nextResult = result;
};

export default getClient;

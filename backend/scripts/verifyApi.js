import http from 'http';

const makeRequest = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const verify = async () => {
  console.log('Verifying APIs (Ensure server is running on port 5000 separately)...');
  try {
    console.log('1. GET /articles');
    const res = await makeRequest('GET', '/articles');
    console.log(`Status: ${res.status}, Count: ${res.body.count}`);

    if (res.body.data && res.body.data.length > 0) {
      const id = res.body.data[0]._id;
      console.log(`2. GET /articles/${id}`);
      const resDetail = await makeRequest('GET', `/articles/${id}`);
      console.log(`Status: ${resDetail.status}, Title: ${resDetail.body.data.title}`);
    }

  } catch (e) {
    console.error('Verification failed (Is the server running?):', e.message);
  }
};

verify();

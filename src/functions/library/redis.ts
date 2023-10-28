import redis from 'redis';

const redisClient = redis.createClient({
  url: 'redis://redis:6379', // Use the service name and port
});

export default redisClient;

import axios from 'axios';

const wiremockPort = process.env.WIREMOCK_PORT || 9999;

export default class Wiremock {
  /**
   * Add a new mapping
   *
   * @static
   * @param {string} data JSON Mapping
   * @memberof Wiremock
   */
  static async mapping(data) {
    await axios
      .post(`http://localhost:${wiremockPort}/__admin/mappings`, data)
      .catch((error) =>
        console.log('An error occurred while add a new mapping ', error)
      );
  }
  /**
   * Reset the server and clean the cache
   *
   * @static
   * @memberof Wiremock
   */
  static async reset() {
    await axios
      .post(`http://localhost:${wiremockPort}/__admin/reset`)
      .catch((error) => console.log(error));
  }
  /**
   * Shutdown the server
   *
   * @static
   * @memberof Wiremock
   */
  static async shutdown() {
    await axios
      .post(`http://localhost:${wiremockPort}/__admin/shutdown`)
      .catch((error) => console.log(error));
  }
}

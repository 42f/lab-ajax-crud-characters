class APIHandler {
  constructor(baseUrl) {
    this.api = axios.create({
			baseURL: baseUrl,
		});
  }

  getFullList() {
    return this.api({ url: `/characters` });
  }

  getOneRegister(id) {
    return this.api({ url: `/characters/${id}` });
  }

  createOneRegister(characterInfos) {
    return this.api({ method: 'post', url: `/characters/`, data: characterInfos });
  }

  updateOneRegister(id) {
    return this.api({ method: 'patch', url: `/characters/${id}`, data: characterInfos });
  }

  deleteOneRegister(id) {
    return this.api({ method: 'delete', url: `/characters/${id}` });
  }
}

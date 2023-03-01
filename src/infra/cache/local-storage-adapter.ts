import { type getStorage, type SetStorage } from '@/data/protocols/cache';

export class LocalStorageAdapter implements SetStorage, getStorage {
	set (key: string, value: object): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	get (key: string): any {
		return JSON.parse(localStorage.getItem(key));
	}
}

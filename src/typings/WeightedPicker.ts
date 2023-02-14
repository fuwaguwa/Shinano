/**
 * 100% credits go to the wrand package creator (https://www.npmjs.com/package/wrand)
 * Package was quite faulty and needed some modification to be fit for Shinano's usage so I moved the code here
 */

export type WeightedItem<T> = {
	name: T;
	weight: number;
};

export type Options = {
	next?: RandomFn;
	removeOnPick?: boolean;
};

export type RandomFn = () => number;

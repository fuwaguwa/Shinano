import { Options, WeightedItem } from "../typings/WeightedPicker";

/**
 * 100% credits go to the wrand package creator (https://www.npmjs.com/package/wrand)
 * Package was quite faulty and needed some modification to be fit for Shinano's usage so I moved the code here
 */
export class WeightedPicker<T> 
{
	private totalWeight: number = 0;
	private items: WeightedItem<T>[] = [];

	constructor(items: WeightedItem<T>[], private options?: Options) 
	{
		this.set(items);
	}

	pick() 
	{
		const random = this.safeNext() * this.totalWeight;
		let currentWeight = 0;

		for (const item of this.items) 
		{
			currentWeight += item.weight;
			if (random <= currentWeight) 
			{
				if (this.options?.removeOnPick) 
				{
					this.internalSet(this.items.filter(i => i !== item));
				}

				return item;
			}
		}

		/* istanbul ignore next */
		if (this.items.length > 0) 
		{
			throw new Error(
				"No idea why this happened, get in touch with the wrand developer!"
			);
		}
		else 
		{
			throw new Error("The list is empty!");
		}
	}

	pickMany(amount: number): T[] 
	{
		const items = [];
		for (let i = 0; i < amount; i++) 
		{
			items.push(this.pick());
		}
		return items;
	}

	/**
	 * picks distinct elements from the weighted array.
	 * If the number of items required is more or equal to the length of weighted array, it will return all elements in array
	 * @param amount - positive number of items to be picked, if more or equal to the length of the array, returns all items
	 * @returns array of picked items
	 * @example
	 * const items = [
	 * { name: "Bronze", weight: 20 },
	 * { name: "Silver", weight: 10 },
	 * { name: "Gold", weight: 3 },
	 * { name: "Platinum", weight: 1 },
	 * ];
	 * const pickerAlwaysLast = new WeightedPicker(items);
	 * const picked1 = pickerAlwaysLast.pickManyDistinct(1);
	 * console.log(picked1.length) // 1
	 * const picked3 = pickerAlwaysLast.pickManyDistinct(3);
	 * console.log(picked3.length) // 3
	 * const picked4 = pickerAlwaysLast.pickManyDistinct(4);
	 * console.log(picked4.length) // 4
	 * console.log(picked4) // ["Bronze", "Silver", "Gold", "Platinum"]
	 * const picked8 = pickerAlwaysLast.pickManyDistinct(8);
	 * console.log(picked8) // throws error number of items cannot be more than length of the array
	 */
	pickManyDistinct(amount: number): T[] 
	{
		if (amount < 0)
			throw new Error(
				"number of items to be picked should be a positive integer"
			);
		if (amount > this.items.length)
			throw new Error(
				"number of items cannot be more than length of the array"
			);
		if (amount === this.items.length) return this.items.map(i => i.name);
		const items: any[] = [];
		const copyOfItems = [...this.items];
		for (let i = 0; i < amount; i++) 
		{
			const picked = this.pick();
			items.push(picked);
			this.set(this.items.filter(item => item.name !== picked));
		}
		this.set(copyOfItems);
		return items;
	}

	set(items: WeightedItem<T>[]) 
	{
		this.validate(items);
		this.internalSet(items);
	}

	getItems(): T[] 
	{
		return this.items.map(i => i.name);
	}

	getWeights(): number[] 
	{
		return this.items.map(i => i.weight);
	}

	getTotalWeight(): number 
	{
		return this.totalWeight;
	}

	getCount(): number 
	{
		return this.items.length;
	}

	private validate(items: WeightedItem<T>[]) 
	{
		if (items.length === 0) 
		{
			throw new Error("Items list is empty!");
		}

		const set = new Set();
		for (const item of items) 
		{
			if (item.weight <= 0) 
			{
				throw new Error(
					`All weights must be positive! ${item.name} has weight ${item.weight}`
				);
			}

			if (set.has(item.name)) 
			{
				throw new Error(`Items must be unique! ${item.name} is duplicate!`);
			}
			set.add(item.name);
		}
	}

	private updateTotalWeight(): void 
	{
		this.totalWeight = this.items.reduce((acc, item) => acc + item.weight, 0);
	}

	private safeNext(): number 
	{
		const random = this.options?.next ? this.options.next() : Math.random();
		if (random < 0 || random > 1) 
		{
			throw new Error(
				`Invalid random number generated, value must be between 0 and 1, received ${random} instead!`
			);
		}

		return random;
	}

	private internalSet(items: WeightedItem<T>[]) 
	{
		this.items = items;
		this.updateTotalWeight();
	}
}

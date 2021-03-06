import FS   = require('fs');
import Path = require('path');

/**
 * Look up for target file/directory.
 * @param startPath Path to start resolution.
 * @param target    Target file/directory.
 */
export function lookUp(startPath: string, target: string): string
{
    let slices = startPath.split(Path.sep);

    while (slices.length > 0)
    {
        let path = Path.join(slices.join('/'), target);

        if (FS.existsSync(path))
        {
            return path;
        }

        slices.pop();
    }

    throw new Error('Can\'t find node_modules on provided root path');
}

/**
 * Deeply merges two or more objects.
 * @param target Object to receive merge.
 * @param source Objects to merge to the target.
 */
export function objectMerge<TTarget = object, TSource = object>(target: TTarget, source: Array<TSource>): TTarget & TSource;
/**
 * Deeply merges two or more objects, and optionally concatenate array values.
 * @param target        Object to receive merge.
 * @param source        Object to merge to the target.
 * @param combineArrays Specify to combine or not arrays.
 */
export function objectMerge<TTarget = object, TSource = object>(target: TTarget, source: Array<TSource>, combineArrays: boolean): TTarget & TSource;
/**
 * Deeply merges two objects.
 * @param target Object to receive merge.
 * @param source Objects to merge to the target.
 */
export function objectMerge<TTarget = object, TSource = object>(target: TTarget, source: TSource): TTarget & TSource;
/**
 * Deeply merges two objects, and optionally concatenate array values.
 * @param target Object to receive merge.
 * @param source Object to merge to the target.
 * @param combineArrays 
 */
export function objectMerge<TTarget = object, TSource = object>(target: TTarget, source: TSource, combineArrays: boolean): TTarget & TSource;
export function objectMerge<TTarget = object, TSource = object>(target: TTarget, source: TSource|Array<TSource>, combineArrays?: boolean): TTarget & TSource
{
    if (!target)
        throw new TypeError('target can\'t be null s');

    if (!source)
        throw new TypeError('source can\'t be null s');

    combineArrays = !!combineArrays;
    
    if (!Array.isArray(source))
        source = [source];

    for (let current of source)
    {
        for (let key of Object.keys(current))
        {
            if (!current[key])
                continue;
                
            if (target[key] && target[key] instanceof Object)
            {
                if (Array.isArray(target[key]) && Array.isArray(current[key]) && combineArrays)
                {
                    target[key] = target[key].concat(current[key]);
                }
                else if (target[key] instanceof Object && current[key] instanceof Object && target[key].constructor.name == 'Object' && current[key].constructor.name == 'Object')
                {
                    target[key] = objectMerge(target[key], current[key], combineArrays);
                }
                else if (current[key])
                {
                    var descriptor = Object.getOwnPropertyDescriptor(current, key);
                    
                    if (descriptor && descriptor.enumerable)
                        target[key] = current[key];
                }
            }
            else if (current[key])
            {
                var descriptor = Object.getOwnPropertyDescriptor(current, key);

                if (descriptor && descriptor.enumerable)
                    target[key] = current[key];
            }
        }
    }

    return target as TTarget & TSource;
}
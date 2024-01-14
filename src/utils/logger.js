const error = (moduleName, functionName, ...messages) => {
    console.error(`${moduleName}:: ${functionName}: `, messages);
}

const warn = (moduleName, functionName, ...messages) => {
    console.warn(`${moduleName}:: ${functionName}: `, messages);
}
const info = (moduleName, functionName, ...messages) => {
    console.log(`${moduleName}:: ${functionName}: `, messages);
}

const Logger = {
    error,
    warn,
    info,
}

export {
    Logger,
}

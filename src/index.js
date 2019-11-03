const commander = require('commander')
var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var shell = require('shelljs');
const packageInfo = require('../package.json')

const program = new commander.Command()

//"ln-erd": "rm -rf ./node_modules/@terminus/console-erd/src  &&   cd node_modules/@terminus/console-erd &&  ln -s -f ../../../../console-erd/src  src "

program
  .version(packageInfo.version, '-v, --version')
  // .option('-c, --config <path>', 'config file path')
  .option('-m, --module <module> ')

program.parse(process.argv)


const cliOption = {
  configPath: program.config,
  filePath: program.file,
  module: program.module,
}

console.log(cliOption)
const moduleName = cliOption.module
if(moduleName) {
  const modulePath = path.join('./node_modules',moduleName )
  fs.readdir(modulePath, (err, files) => {
    if(err) throw err;
    console.log(` 找到模块 ${modulePath} 下面的文件夹： `);
    
    files.forEach(f=>{
      if(f === 'node_modules') return 
      const dPath = path.join(modulePath,f)
      fs.stat( dPath, (sErr , stat) => {
        if(sErr) throw sErr;
        const isDir = stat.isDirectory()
        if(isDir) {
          console.log(dPath);
          lnDir(dPath, moduleName)
        }
      })
    })
  });

}

const lnDir = (dPath, moduleName) => {
    const [moduleRealName] =  /[^\/]+$/.exec(moduleName)
    const [dName] = /[^\/]+$/.exec(dPath)
    const paths = dPath.split('/')

    // console.log(dName +  '  ' + moduleRealName)
    
    fs.exists(`../${moduleRealName}`, (exists) => {
      if(exists) {
        const toPath = `${(setList(paths.length)).map(a=>'../').join('')}${moduleRealName}/${dName}`
        const linkcmd = ` ls ../${moduleRealName}  && rm -rf ${dPath} && cd ${paths.slice(0, -1).join('/')} &&  ln -s -f ${toPath}  ${dName}`
        console.log(linkcmd)
        shell.exec(linkcmd)
       
      } else {
        console.error(`找不到可以链接的路径： ${path.resolve(`../${moduleRealName}/${dName}`)}  `)
        // shell.echo('Sorry, this script requires git');
        // shell.exec('ls')
      }
    })
  

    // "rm -rf ./node_modules/@terminus/console-erd/src  &&   cd node_modules/@terminus/console-erd &&  ln -s -f ../../../../console-erd/src  src "


}

const setList = (length) => {
    const list = []
    for(var i = 0 ; i < length ; i ++ ) {
        list.push(i)
    }
    return list
}




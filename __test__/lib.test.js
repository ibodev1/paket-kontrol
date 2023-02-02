import test from 'ava';
import execa from 'execa';

const execOptions = {
  preferLocal: true,
  localDir: 'C:\\Users\\kobiyzlm-L41-01\\Desktop\\ibrahim\\cli-test\\__test__',
  execPath: 'C:\\Users\\kobiyzlm-L41-01\\Desktop\\ibrahim\\cli-test\\__test__',
  cwd: 'C:\\Users\\kobiyzlm-L41-01\\Desktop\\ibrahim\\cli-test\\__test__',
};

test('Update check', async t => {
  try {
    const exec = await execa('node ../cli.js', [], execOptions);

    const updatesPackageTemplate = `
    ----------------------------------------
    Güncellenecek paketler;
    
    react: "16.0.0" ==> "18.2.0"
    next: "10.0.0" ==> "13.1.6"
    tailwindcss-palette-generator: "0.1.5" ==> "0.2.5"
        
    Güncellemek için : npx paket-kontrol -u
    ----------------------------------------`;

    t.is(exec.stdout, updatesPackageTemplate);
  } catch (error) {
    console.log(error);
    t.fail();
  }
});

test('Update write file', async t => {
  try {
    const exec = await execa('node ../cli.js', ['-u'], execOptions);

    const updatedPackageTemplate = `
    ----------------------------------------
    Güncellenen paketler;
    
    react: "18.2.0"
    next: "13.1.6"
    tailwindcss-palette-generator: "0.2.5"
        
    Güncellenen paketleri indirmek için : npm install yada yarn install
    ----------------------------------------`;

    t.is(exec.stdout, updatedPackageTemplate);
  } catch (error) {
    console.log(error);
    t.fail();
  }
});

test('Check updated', async t => {
  try {
    const exec = await execa('node ../cli.js', [], execOptions);

    const execUpdate = await execa('node ../cli.js', ['-u'], execOptions);

    const responseMessage = 'Tebrikler! tüm paketleriniz güncel!';

    t.is(exec.stdout, responseMessage);
    t.is(execUpdate.stdout, responseMessage);
  } catch (error) {
    console.log(error);
    t.fail();
  }
});

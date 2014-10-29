require 'tmpdir'

def extension_path
  File.expand_path('chrome_launcher', __dir__)
end

def in_temporary_directory(&block)
  Dir.mktmpdir do |tmpdir|
    Dir.chdir tmpdir, &block
  end
end

def with_decrypted_file(file)
  file = File.expand_path(file)

  in_temporary_directory do
    decrypted = File.expand_path('key.pem')
    rm_f decrypted, verbose: false
    sh 'gpg', '--output', decrypted, '--decrypt', file
    yield decrypted
    rm_f decrypted
  end
end

desc 'pack extension into .crx chrome extension file'
task :crx do
  with_decrypted_file('key.pem.gpg') do |key|
    sh 'chromium',
       '--no-message-box',
       "--pack-extension=#{extension_path}",
       "--pack-extension-key=#{key}"
  end
end

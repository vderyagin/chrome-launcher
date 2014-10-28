require 'tmpdir'

def extension_name
  File.basename(__dir__)
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

desc 'pack extension'
task :pack do
  with_decrypted_file('key.pem.gpg') do |key|
    sh 'chromium',
       '--no-message-box',
       "--pack-extension=#{__dir__}",
       "--pack-extension-key=#{key}"
  end

  mv File.expand_path("#{extension_name}.crx", '..'), '.'
end

task default: :pack

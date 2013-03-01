class install {

    $currentuser = "tim" # todo: automate this 
    $appuser = "www-data"
    $dbuser = "root"
    $dbpassword = "{root|db|user}"
    $dbname = "marco_rbs"
    $projectname = "django_app"
    $appspath = "/usr/local/apps"
    $reponame = "marco_boater_survey"
    $appname = "draw_app"
    $secretkey = "secret"
    $mapkey = "AIzaSyAuGMb83HBophhruCp62MrfvWp1zMoB0nQ"
    $adminemail = "aws-marcoboater@ecotrust.org"

    # ensure that apt update is run before any packages are installed
    class apt {
      exec { "apt-update":
        command => "/usr/bin/apt-get update"
      }

      # Ensure apt-get update has been run before installing any packages
      Exec["apt-update"] -> Package <| |>

    }

    include apt

    package { "build-essential":
        ensure => "installed"
    }

    package { "python-software-properties":
        ensure => "installed"
    }

    package { "git-core":
        ensure => "latest"
    }

    package { "subversion":
        ensure => "latest"
    }

    package { "mercurial":
        ensure => "latest"
    }

    package { "csstidy":
        ensure => "latest"
    }

    package { "vim":
        ensure => "latest"
    }

    package { "python-psycopg2":
        ensure => "latest"
    }

    package { "python-virtualenv":
        ensure => "latest"
    }

    package { "python-dev":
        ensure => "latest"
    }

    package { "python-numpy":
        ensure => "latest"
    }

    package { "python-scipy":
        ensure => "latest"
    }

    package { "python-gdal":
        ensure => "latest"
    }

    package { "gfortran":
        ensure => "latest"
    }

    package { "libopenblas-dev":
        ensure => "latest"
    }

    package { "liblapack-dev":
        ensure => "latest"
    }

    package { "redis-server":
        ensure => "latest"
    }

    package {'libgeos-dev':
        ensure => "latest"
    }

    package {'libgdal1-dev':
        ensure => "latest"
    }

    package {'supervisor':
        ensure => "latest"
    }

    class { "postgresql::server": version => "9.1",
        listen_addresses => 'localhost',
        max_connections => 100,
        shared_buffers => '24MB',
    }

    # postgresql::db { $dbname:
    #   user      => "${dbuser}",
    #   password  => "${dbpassword}",
    # }
    postgresql::database { $dbname:
      owner => "${appuser}",
    }

    exec { "load postgis":
      command => "/usr/bin/psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql -d ${dbname}",
      user => "${appuser}",
      require => Postgresql::Database[$dbname]
    }

    exec { "load spatialrefs":
      command => "/usr/bin/psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql -d ${dbname}",
      user => "${appuser}",
      require => Postgresql::Database[$dbname]
    }


    exec { "load postgis template1":
      command => "/usr/bin/psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql -d template1",
      user => "postgres",
      require => Postgresql::Database[$dbname]
    }

    exec { "load spatialrefs template1":
      command => "/usr/bin/psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql -d template1",
      user => "postgres",
      require => Postgresql::Database[$dbname]
    }

    #exec { "load cleangeometry template1":
    #  command => "/usr/bin/psql -d template1 -f /tmp/vagrant-puppet/manifests/files/cleangeometry.sql",
    #  user => "postgres",
    #  require => Postgresql::Database[$dbname]
    #}
        
    python::venv::isolate { "/usr/local/venv/${projectname}":
      owner => "${appuser}",
      group => "${appuser}",
      subscribe => [Package['python-virtualenv'], Package['build-essential']]
    }

    file { "${appspath}":
      ensure => "directory",
      owner => "${appuser}",
      group => "${appuser}",
      mode => 775,
    }

    file { "${appspath}/${reponame}":
      ensure => "directory",
      owner => "${appuser}",
      group => "${appuser}",
      mode => 775,
      require => File["${appspath}"],
    }

    file { "${appspath}/${reponame}/${projectname}":
      ensure => "directory",
      owner => "${appuser}",
      group => "${appuser}",
      mode => 775,
      require => File["${appspath}/${reponame}"],
    }

    file { "local_settings.py":
      path => "${appspath}/${projectname}/local_settings.py",
      content => template("local_settings.py"),
      require => [Exec['load spatialrefs template1'], File["${appspath}/${reponame}/${projectname}"]]
    }

    file { "go":
      path => "/home/${currentuser}/go",
      content => template("go"),
      owner => "${appuser}",
      group => "${appuser}",
      mode => 0775
    }

}

include install
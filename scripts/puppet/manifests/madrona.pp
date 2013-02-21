class install {

    $dbname = "marco_rbs"
    $projectname = "django_app"
    $reponame = "marco_boater_survey"
    $appname = "draw_app"
    $secretkey = "secret"
    $mapkey = "map_key"

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

    postgresql::database { $dbname:
      owner => "vagrant",
    }

    exec { "load postgis":
      command => "/usr/bin/psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql -d ${dbname}",
      user => "vagrant",
      require => Postgresql::Database[$dbname]
    }

    exec { "load spatialrefs":
      command => "/usr/bin/psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql -d ${dbname}",
      user => "vagrant",
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
      subscribe => [Package['python-virtualenv'], Package['build-essential']]
    }

    file { "settings_local.py":
      path => "/vagrant/${projectname}/local_settings.py",
      content => template("settings_vagrant.py"),
      require => Exec['load spatialrefs template1']
    }

    file { "go":
      path => "/home/vagrant/go",
      content => template("go"),
      owner => "vagrant",
      group => "vagrant",
      mode => 0775
    }

}

include install
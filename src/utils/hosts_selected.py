from enum import IntEnum

from utils.custom_exceptions import HostAlreadyAdded, MissingHost

class HostConnectionMethod(IntEnum):
    PASSWORD_BASED = 0
    KEY_BASED = 1

class SingletonHostsSelected():
    """
    This class is a sigleton object for HostsSelected class
    """
    _instance = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instance:
            class_._instance[class_] = super(SingletonHostsSelected, class_).__new__(class_)
        return class_._instance[class_]


class Host():
    """This class represents one host object to export it to yml for the ansible inventory
    """
    def __init__(self, hostname : str, host_ip : str, host_port : int):
        """Create Host instance and fill hostname, host_ip and host_port

        Args:
            hostname (str): The name of the host
            host_ip (str): The ip or fqdn of the host
            host_port (int): The ssh port of the host

        Raises:
            ValueError: If there are missing value, raise the Exception
        """
        hostname = hostname.strip()
        host_ip = host_ip.strip()
        if len(hostname) > 0:
            self.hostname = hostname
        else:
            raise ValueError("A value for hostname must be defined")
        if len(host_ip) > 0:
            self.host_ip = host_ip
        else:
            raise ValueError("A value for host_ip must be defined")
        if host_port > 0:
            self.host_port = host_port
        else:
            raise ValueError("A value for host_port must be defined")

    def set_connection_method(self,connection_method: int , username : str, pass_or_keyfile : str):
        """Fill connection_method, username and pass_or_keyfile.

        Args:
            connection_method (HostConnectionMethod): Value from the Enum, define user/password or user/keyfile connection method
            username (str): user to connect on host using ssh
            pass_or_keyfile (str): password or the path of the keyfile to connect on host using ssh

        Raises:
            ValueError: If there are missing value, raise the Exception
        """
        username = username.strip()
        pass_or_keyfile = pass_or_keyfile.strip()
        if connection_method == HostConnectionMethod.PASSWORD_BASED or connection_method == HostConnectionMethod.KEY_BASED:
            self.connection_method = connection_method
        else:
            raise ValueError("The variable connection_method must be an element of HostConnectionMethod Enum")
        if len(username) > 0:
            self.username = username
        else:
            raise ValueError("A value for username must be defined")
        if len(pass_or_keyfile) > 0:
            self.pass_or_keyfile = pass_or_keyfile
        else:
            raise ValueError("A value for pass_or_keyfile must be defined")    

    def set_sudo_access(self, sudo_username: str, sudo_password: str):
        """Fill sudo_username and sudo_password to permits privilege escalation

        Args:
            sudo_username (str): username of a user with sudo privilege
            sudo_password (str): password of a user with sudo privilege

        Raises:
            ValueError: If there are missing value, raise the Exception
        """
        sudo_username = sudo_username.strip()
        sudo_password = sudo_password.strip()
        if len(sudo_username) > 0:
            self.sudo_username = sudo_username
        else:
            raise ValueError("A value for sudo_username must be defined")
        if len(sudo_password) > 0:
            self.sudo_password = sudo_password
        else:
            raise ValueError("A value for sudo_password must be defined") 

    def get_yml(self) -> str:
        """Render the Host instance into a string with yml syntax for the Ansible inventory file

        Raises:
            ValueError: If the value of connection_method is not in the Enum

        Returns:
            str: The yml string
        """
        ret_str = f"    {self.hostname}:\n"
        ret_str+= f"      ansible_host: {self.host_ip}\n"
        ret_str+= f"      ansible_port: {self.host_port}\n"
        ret_str+= f"      ansible_user: {self.username}\n"
        
        if self.connection_method == HostConnectionMethod.PASSWORD_BASED:
            ret_str+= f"      ansible_password: {self.pass_or_keyfile}\n"
        elif self.connection_method == HostConnectionMethod.KEY_BASED:
            ret_str+= f"      ansible_ssh_private_key_file: {self.pass_or_keyfile}\n"
        else:
            raise ValueError("The variable connection_method must be an element of HostConnectionMethod Enum")
        
        ret_str+= f"      ansible_become: true\n"
        ret_str+= f"      ansible_become_method: su\n"
        ret_str+= f"      ansible_become_user: {self.sudo_username}\n"
        ret_str+= f"      ansible_become_password: {self.sudo_password}\n"


        ret_str+= f"      ansible_ssh_extra_args: '-o IdentitiesOnly=yes'"
        return ret_str


class HostsSelected(SingletonHostsSelected):
    """This class keep in memory which hosts are selected and their configuration
    """
    hosts :list[Host] = []

    def add_host(self, host : dict):
        """Create a host and add it to the list of hosts

        Args:
            host (dict): Dict that contains value to add host

        Raises:
            HostAlreadyAdded : If the hostname already exists
            ValueError: If there are missing value, raise the Exception
        """
        
        try:
            if self.is_hostname_unique(host["hostname"]):
                h = Host(host["hostname"],host["ip"],host["port"])
                h.set_connection_method(host["connection"], host["username"], host["passwordOrKeyfile"])
                h.set_sudo_access(host["sudoUsername"], host["sudoPassword"])
                self.hosts.append(h)
            else:
                raise HostAlreadyAdded(f"A host with the name {host['hostname']} is already existing")
        except ValueError as value_error:
            raise value_error

    def is_hostname_unique(self, new_hostname: str) -> bool:
        """Check if the hostname has already been added

        Args:
            new_hostname (str): The hostname to check

        Raises:
            ValueError: If there are missing value, raise the Exception

        Returns:
            bool: True if the hostname is unique else False
        """
        if len(new_hostname) > 1:
            for host in self.hosts:
                if host.hostname.strip() == new_hostname.strip():
                    return False
        else:
            raise ValueError("A value for hostname must be defined")
        
        return True
    
    def write_yml(self):
        try:
            if len(self.hosts) == 0:
                raise MissingHost("There must be at least one host")

            with open("inventory.yml","w") as inventory_file:
                inventory_file.write(f"all:\n  hosts:\n")
                
                for host in self.hosts:
                    inventory_file.write(host.get_yml())
        except ValueError as value_error:
            raise value_error

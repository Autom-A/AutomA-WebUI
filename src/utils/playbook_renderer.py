from jinja2 import Environment, FileSystemLoader

class PlaybookRenderer:
    """
    This class is a convenient way to load and render jinja templates

    ## Example:

    ```python
    from playbook_renderer import PlaybookRenderer
    rend = PlaybookRenderer(".")
    print(rend.render("t.yml.j2", {"used_users": ["root", "aigle"]}))
    ```
    """

    def __init__(self, dir_path: str):
        """
        Constructor...

        Parameters:
            - dir_path<str> : The root dir where templates are stored 
        """
        self.env = Environment(auto_reload=False, loader = FileSystemLoader(dir_path))
    
    def render(self, path: str, variables: dict) -> str:
        """
        Renderer...

        Parameters:
            - path<str>       : The path from dir_path where template is stored
            - variables<dict> : A dict containing variable names and variable values to render in the template
        
        Return:
            - rendered<str> : The rendered template
        """
        return self.env.get_template(path).render(**variables)